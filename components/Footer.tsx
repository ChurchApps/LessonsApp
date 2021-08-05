import Image from "next/image";
import logo from "@public/images/logo-dark.png";

export function Footer() {
  return (
    <div id="footer">
      <div className="text-center">
        <div className="mb-3">
          <Image src={logo} alt="logo" width={450} height={80} />
        </div>
        <p>Phone: 918-994-2638 &nbsp; | &nbsp; support@churchapps.org</p>
        <p>2021 © Live Church Solutions. All rights reserved.</p>
      </div>
    </div>
  );
}
