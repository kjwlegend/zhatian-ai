import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 ml-4">
      <Image src="/logo.png" alt="Logo" width={120} height={40} />
    </Link>
  );
}
