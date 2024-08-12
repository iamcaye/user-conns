'use client'
import { CakeIcon } from "@/components/icons/cake";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { PinMapIcon } from "@/components/icons/map-pin";
import { UserPlusIcon } from "@/components/icons/user-plus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [users, setUsers]: any[] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  let { toast } = useToast();

  useEffect(() => {
    document.addEventListener('scroll', function() {
      checkScroll();
    });

    document.addEventListener('resize', function() {
      checkScroll();
    });

    return () => {
      document.removeEventListener('scroll', function() {
        checkScroll();
      });

      document.removeEventListener('resize', function() {
        checkScroll();
      });
    }

  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/users/suggestions?page=${page}&page_size=12`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(users.concat(data));
        setLoading(false);
        setTimeout(() => {
          checkScroll();
          if (page != 0) scrollDown(window.innerHeight / 3);
        }, 100);
      });
  }, [page]);

  function checkScroll() {
    if (!buttonRef.current) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.body.offsetHeight;

    let diff = (documentHeight - scrollPosition) / documentHeight;
    if (diff < 0.4) {
      buttonRef.current.style.opacity = (1 - diff * 2).toString();
      buttonRef.current.style.visibility = 'visible';
      buttonRef.current.disabled = false;
    } else {
      buttonRef.current.style.opacity = '0';
      buttonRef.current.style.visibility = 'hidden';
      buttonRef.current.disabled = true;
    }
  }

  function scrollDown(length: number) {
    window.scrollBy({
      top: length,
      behavior: 'smooth'
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: text,
      style: { backgroundColor: "blue", color: "white", opacity: 0.9 },
      duration: 1000
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Toaster />
      {loading && users.length == 0 && <p>Loading...</p>}
      {users.length != 0 &&
        <div className="flex flex-wrap gap-8 justify-center mb-10">
          {users.map((user: any) => (
            <Card key={user.id} className="m-2 flex-wrap shadow-lg animate-fade-in sm: w-full md:w-6/12 lg:w-4/12 xl:w-3/12">
              <CardTitle className="px-4 pt-2 pb-0 text-xl flex items-center justify-between">
                <span className="flex gap-4">
                  <img src={user.pictures[0].url} alt="profile" className="w-10 h-10 rounded-full" />
                  <p>{user.name} {user.last_name}</p>
                </span>
                <img src={`https://flagsapi.com/${user.location.country_code}/shiny/32.png`} alt="flag" />
              </CardTitle>
              <CardDescription className="px-4 mt-[-16px] ml-14">
                @{user.username}
              </CardDescription>
              <CardContent className="p-4 px-5 flex flex-col justify-between h-max">
                <span className="flex items-center gap-4 p-2">
                  <CakeIcon className="w-5 h-5" />
                  <p>{user.dob.toString().split('T')[0]}</p>
                </span>
                <span className="flex items-center gap-4 p-2">
                  <PinMapIcon className="w-5 h-5" />
                  <p>{user.location.city}, {user.location.state}, {user.location.country}</p>
                </span>
                <span className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded-lg" onClick={() => copyToClipboard(user.email)}>
                  <EnvelopeIcon className="w-5 h-5" />
                  <p className="truncate">{user.email}</p>
                </span>
                <span className="flex items-end justify-center">
                  <Button className="bg-primary text-white px-4 py-2 mt-4 rounded-lg">
                    Connect
                    <UserPlusIcon className="w-5 h-5 ml-2" />
                  </Button>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      }
      <div className="fixed bottom-0 flex justify-center w-full p-4">
        <button ref={buttonRef} onClick={() => setPage(page + 1)} className="p-2 px-4 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-100 transition-opacity duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
          </svg>
        </button>
      </div>
      <script>
      </script>
    </main>
  );
}
