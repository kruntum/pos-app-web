 import "../../public/plugins/fontawesome-free/css/all.min.css";
import "../../public/dist/css/adminlte.min.css";




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
