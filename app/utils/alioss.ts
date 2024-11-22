import OSS from "ali-oss";

const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID;
const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET;
const OSS_BUCKET = process.env.OSS_BUCKET;

const getossClient = () => {
	return new OSS({
		region: "oss-cn-shanghai",
		accessKeyId: OSS_ACCESS_KEY_ID!,
		accessKeySecret: OSS_ACCESS_KEY_SECRET!,
		bucket: OSS_BUCKET!,
	});
};

export default class AliOSS {
	// 上传文件到指定"文件夹"
	static async put(
		fileName: string,
		data: Buffer,
		folderName?: string,
	): Promise<void> {
		const ossClient = getossClient();
		const objectKey = folderName ? `${folderName}/${fileName}` : fileName;

		try {
			const result = await ossClient.put(objectKey, data);
			console.log(`File uploaded successfully to ${objectKey}`);
			console.log(`Uploading to ${objectKey} with data length: ${data.length}`);
			// console.log(result);
		} catch (e) {
			console.error(`Error uploading file to ${objectKey}:`, e);
			throw e;
		}
	}

	// Get file from OSS
	static async get(fileName: string): Promise<OSS.GetObjectResult | null> {
		const ossClient = getossClient();

		try {
			const result = await ossClient.get(fileName);
			console.log(`File retrieved successfully: ${fileName}`);
			return result;
		} catch (e) {
			console.error(`Error retrieving file ${fileName}:`, e);
			return null;
		}
	}

	// Delete file from OSS
	static async delete(fileName: string): Promise<void> {
		const ossClient = getossClient();

		try {
			await ossClient.delete(fileName);
			console.log(`File deleted successfully: ${fileName}`);
		} catch (e) {
			console.error(`Error deleting file ${fileName}:`, e);
			throw e;
		}
	}
}
