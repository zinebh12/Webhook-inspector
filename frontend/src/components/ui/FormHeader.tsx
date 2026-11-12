import Image from "next/image";
import Logo from "./../../../public/logo.svg";

const FormHeader = () => {
  return (
    <div className="flex flex-col items-center gap-3 text-center text-text-primary">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border-default bg-app-background shadow-lg shadow-pink-500/10">
        <Image src={Logo} width={40} height={40} alt="logo" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Webhook <span className="text-text-pinkest">Inspector</span>
        </h1>
        <p className="text-sm text-text-secondary">
          Every event. Every request. One place.
        </p>
      </div>
    </div>
  );
};

export default FormHeader;
