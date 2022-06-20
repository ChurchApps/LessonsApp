export function Footer() {
  return (
    <div id="footer">
      <div className="text-center">
        <img src="/images/logo-dark.png" alt="Free church curriculum" className="img-fluid" />
        <p>Phone: 918-994-2638 &nbsp; | &nbsp; support@churchapps.org</p>
        <p>{new Date().getFullYear()} © Live Church Solutions. All rights reserved.</p>
      </div>
    </div>
  );
}
