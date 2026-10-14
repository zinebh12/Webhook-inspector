import Image from "next/image";
import Logo from "./../../../public/logo.svg";

const FormHeader = () => {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10 shadow-lg shadow-blue-500/10">
        <Image src={Logo} width={40} height={40} alt="logo" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Webhook <span className="text-blue-400">Inspector</span>
        </h1>
        <p className="text-sm text-slate-400">
          Every event. Every request. One place.
        </p>
      </div>
    </div>
  );
};

export default FormHeader;
