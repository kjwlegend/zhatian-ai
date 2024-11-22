import { NextRequest, NextResponse } from "next/server";
import AliOSS from "@/app/utils/alioss";

const OSS_BASE = "https://xiaoguangai.oss-cn-shanghai.aliyuncs.com";


async function handle(req: NextRequest) {
	if (req.method === "OPTIONS") {
		return NextResponse.json({ body: "OK" }, { status: 200 });
	}


	try {
		const formData = await req.formData();
		const file = formData.get("file") as File; // 处理任意类型的文件
		const folderName = formData.get("folderName") as string | undefined;
		console.log(formData);

		// 使用更高效的方式处理文件数据
		const chunks: Uint8Array[] = [];
		const fileReader = file.stream().getReader();
		
		try {
			while (true) {
				const { done, value } = await fileReader.read();
				if (done) break;
				chunks.push(value);
			}
		} finally {
			fileReader.releaseLock();
		}
		
		// 使用 Buffer.concat 更高效地合并数据
		const buffer = Buffer.concat(chunks);
		const fileName = `${Date.now()}_${file.name}`; // 使用原文件名

		console.log("fileName: ", fileName);
		await AliOSS.put(fileName, buffer, folderName); // 上传文件

		return NextResponse.json(
			{
				originalFilename: file.name,
				size: file.size,
				fileName: `${folderName}/${fileName}`,
				filePath: `${OSS_BASE}/${folderName}/${fileName}`,
				status: "done",
			},
			{
				status: 200,
			},
		);
	} catch (e) {
		return NextResponse.json(
			{
				error: true,
				msg: (e as Error).message,
			},
			{
				status: 500,
			},
		);
	}
}

export const POST = handle;

export const runtime = "nodejs";
