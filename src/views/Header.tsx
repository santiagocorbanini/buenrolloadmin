import { LogOut, PanelLeftOpen } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
// import { ThemeToggle } from "@/components/ui/theme-toggle";
import ConfirmationModal from "@/components/ConfirmationModal";
import LogoBuenRollo from "@/assets/nota-azul.png";

interface HeaderProps {
  email?: string;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Header = ({ email, menuOpen, setMenuOpen }: HeaderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="w-full py-4 px-6 bg-background border-b flex items-center justify-between relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 -ml-2 z-10 flex items-center justify-center"
        >
          <PanelLeftOpen className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2 md:flex-none absolute left-1/2 transform -translate-x-1/2 md:static md:left-auto md:transform-none">
          <img src={LogoBuenRollo} alt="Logo" className="w-8 h-8 rounded-sm" />
          <span className="font-bold text-lg tracking-tight">
            Buen Rollo Admin
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-8 ml-auto md:ml-0 z-10">
          <span className="hidden md:inline-flex items-center">
            Bienvenido: {email ? email.split("@")[0] : ""}
          </span>
          {/*           <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="w-5 h-5 flex items-center justify-center">
                <ThemeToggle />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="bottom"
              sideOffset={8}
              className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg"
            >
              Cambiar tema
            </Tooltip.Content>
          </Tooltip.Root> */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                aria-label="Cerrar sesión"
                className="hover:text-red-500 transition flex items-center justify-center h-6 w-6"
                onClick={() => setShowLogoutModal(true)}
              >
                <LogOut className="h-6 w-6" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="bottom"
              sideOffset={8}
              className="px-2 py-1 rounded bg-black text-white text-xs shadow-lg"
            >
              Cerrar sesión
            </Tooltip.Content>
          </Tooltip.Root>
        </div>
      </header>

      <ConfirmationModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        title="¿Estás seguro que deseas cerrar sesión?"
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        buttonsAlignment="center"
        equalWidthButtons={true}
      />
    </>
  );
};

export default Header;
