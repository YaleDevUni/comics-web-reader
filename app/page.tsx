import Link from "next/link";
import Nav from "./components/navigation/navigation";
export default function Home() {
  return (
    <div>
      <div className=" m-2 border-0 p-2 rounded-md bg-orange-500 w-fit">
        <Link href="/viewer">Zip viewer</Link>
      </div>
      <p>This version only support Webp images in Zip file.</p>
      <p>Version 0.1.1</p>
    </div>
  );
}
