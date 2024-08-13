'use client'
import useAuth from "@/hooks/useAuth";
import { Button } from "./button";
import { LogoutIcon } from "../icons/logout-icon";
import { LoginIcon } from "../icons/login-icon";

export function NavBarComponent() {
  let { user, logout }: any = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-between py-4 px-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold align-middle">Users Connections</h1>
          <h2 className="pl-14 text-lg font-light align-middle">
            Connect with everyone, everywhere...
          </h2>
        </div>
        <div className="flex items-center">
          {!user && <Button>
            <a href="/login">Login</a>
            <LoginIcon className="w-5 h-5 ml-2" />
          </Button>}
          {user &&
            <div className="flex items-center">
              <p className="pr-4">Welcome, {user?.name} {user?.last_name}</p>
              <Button onClick={logout}>
                Logout
                <LogoutIcon className="w-5 h-5 ml-2" />
              </Button>
            </div>
          }
        </div>
      </div>
    </nav>
  );
}
