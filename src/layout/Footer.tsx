export default function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <span className="font-headline-md text-[24px] font-bold text-on-surface block mb-4">MSSC 2026</span>
            <p className="font-body-md text-on-surface-variant">Empowering the workforce of tomorrow through strategic recruitment and state-level registration initiatives.</p>
          </div>
          <div>
            <h3 className="font-label-md text-[14px] font-semibold text-primary mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li><a className="font-label-sm text-[12px] font-medium text-on-surface-variant hover:text-primary transition-all" href="#">Registration Guide</a></li>
              <li><a className="font-label-sm text-[12px] font-medium text-on-surface-variant hover:text-primary transition-all" href="#">Eligibility Criteria</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-md text-[14px] font-semibold text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a className="font-label-sm text-[12px] font-medium text-on-surface-variant hover:text-primary transition-all" href="#">Contact Support</a></li>
              <li><a className="font-label-sm text-[12px] font-medium text-on-surface-variant hover:text-primary transition-all" href="#">FAQ Section</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-label-md text-[14px] font-semibold text-primary mb-4">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-[12px] font-medium">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>info@mssc2026.gov.in</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-[12px] font-medium">
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>+91 987 654 3210</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/30 gap-4">
          <p className="font-label-sm text-[12px] font-medium text-on-surface-variant">© 2026 MSSC Council. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="font-label-sm text-[12px] font-medium text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy Policy</a>
            <a className="font-label-sm text-[12px] font-medium text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}