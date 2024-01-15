import Image from "next/image";

export default function SidebarLogo() {
  return (
    <div
      className={`flex flex-row items-center h-full w-full`}
    >
      {/* < className="h-12 w-12 rotate-[15deg]" /> */}
      <Image
        className=""
        src={"/hcga-logo.png"}
        width={1000}
        height={500}
        alt="Logo Divisi HCGA"
      />
    </div>
  );
}
