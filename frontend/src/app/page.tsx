'use client'
import { CakeIcon } from "@/components/icons/cake";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { PinMapIcon } from "@/components/icons/map-pin";
import { UserCircleIcon } from "@/components/icons/user-circle";
import { UserPlusIcon } from "@/components/icons/user-plus";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  let [users, setUsers]: any[] = useState([]);
  let [connections, setConnections]: any[] = useState([]);
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(0);
  let buttonRef = useRef<HTMLButtonElement>(null);
  let { toast } = useToast();
  let userAuth: any = useAuth();

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

  function fetchSuggestions() {
    console.log('Fetching suggestions... Page=', page);
    setLoading(true);
    fetch(`http://localhost:8000/api/users/suggestions/${userAuth?.user?.id || 0}?page=${page}&page_size=12`)
      .then((res) => res.json())
      .then((data) => {
        // wait for userAuth to be set
        setUsers(users.concat(data));
        setLoading(false);
        setTimeout(() => {
          checkScroll();
          if (page != 0) scrollDown(window.innerHeight / 3);
        }, 100);
      });
  }

  useEffect(() => {
    if (userAuth?.user) {
      fetchSuggestions();
    }
  }, [0, userAuth?.user]);

  useEffect(() => {
    if (page != 0) {
      fetchSuggestions();
    }
  }, [page]);

  function onClickMoreSuggestions() {
    setPage(page + 1);
  }

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

  function handleConnect(user: any) {
    console.log('Connected!', user);
    setConnections(connections.concat(user));
    fetch(`http://localhost:8000/api/users/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userAuth?.user?.id,
        user_id_to_connect: user.id
      })
    }).then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast({
            title: "Error!",
            description: data.error,
            style: { backgroundColor: "red", color: "white", opacity: 0.9 },
            duration: 1000
          });
          return;
        } else {
          toast({
            title: "Connected!",
            description: `You are now connected to ${user.name} ${user.last_name}`,
            style: { backgroundColor: "green", color: "white", opacity: 0.9 },
            duration: 1000
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Error!",
          description: err,
          style: { backgroundColor: "red", color: "white", opacity: 0.9 },
          duration: 1000
        });
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Toaster />
      {loading && users.length == 0 && <p>Loading...</p>}
      {users.length != 0 &&
        <div className="flex flex-wrap gap-8 justify-center mb-10">
          {users.map((user: any, index: number) => (
            <Card key={user.id} className="m-2 flex-wrap shadow-lg animate-fade-in sm: w-full md:w-6/12 lg:w-4/12 xl:w-3/12">
              <CardTitle className="px-4 pt-2 pb-0 text-xl flex items-center justify-between">
                <span className="flex">
                  <Avatar className="mt-2 mr-4">
                    <AvatarImage src={user.pictures[0].url} alt="avatar" />
                    <AvatarFallback>{user.name[0].toUpperCase()}{user.last_name[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p>{user.name} {user.last_name}</p>
                </span>
                <img src={`https://flagsapi.com/${user.location.country_code}/shiny/32.png`} alt="flag" />
              </CardTitle>
              <CardDescription className="px-4 mt-[-24px] ml-14">
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
                  <Button
                    onClick={() => handleConnect(user)}
                    className={connections.includes(user)
                      ? "bg-primary text-white px-4 py-2 mt-4 rounded-lg flex items-center align-middle animate-connect"
                      : "bg-primary text-white px-4 py-2 mt-4 rounded-lg flex items-center align-middle"
                    }
                  >
                    {connections.includes(user) ?
                      <>
                        <p>Connected!</p>
                        <UserCircleIcon className="w-5 h-5 ml-2 text-green-500" />
                      </>
                      :
                      <>
                        <p>Connect</p>
                        <UserPlusIcon className="w-5 h-5 ml-2 text-white" />
                      </>
                    }
                  </Button>
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      }
      <div className="fixed bottom-0 flex justify-center w-full p-4">
        <button ref={buttonRef} onClick={() => onClickMoreSuggestions()} className="p-2 px-4 bg-primary text-white rounded-full shadow-lg hover:bg-opacity-100 transition-opacity duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
          </svg>
        </button>
      </div>
      <script>
      </script>
    </main >
  );
}
