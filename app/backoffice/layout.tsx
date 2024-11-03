import "../../public/plugins/fontawesome-free/css/all.min.css";
import "../../public/dist/css/adminlte.min.css";
import "../../public/plugins/overlayScrollbars/css/OverlayScrollbars.min.css";


{/* <script src="../public/plugins/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
<script src="../public/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js" strategy="afterInteractive" />
<script src="../public/dist/js/adminlte.min.js" strategy="afterInteractive" />
<script src="../public/dist/js/demo.js" strategy="afterInteractive" />
<script src="../public/plugins/jquery/jquery.min.js" strategy="afterInteractive" /> */}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NavbarComponent from "../component/navbar-menu";
import SidebarMenu from "../component/sidebar-menu";
import FooterComponent from "../component/footer";


export default function backofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <div className="wrapper">
          <NavbarComponent />
          <SidebarMenu />
          <div className="content-wrapper">
            <section className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12">{children}</div>
                </div>
              </div>
            </section>
          </div>
          <FooterComponent />
        </div>
  );
}
