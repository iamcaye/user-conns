'use client'
import { CakeIcon } from "@/components/icons/cake";
import { EnvelopeIcon } from "@/components/icons/envelope";
import { PinMapIcon } from "@/components/icons/map-pin";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function Home() {
  const [users, setUsers]: any[] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/users/suggestions?page=${page}&page_size=12`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(users.concat(data));
        setLoading(false);
        setTimeout(() => {
          checkScroll();
          scrollDown(window.innerHeight / 2);
        }, 100);
      });
  }, [page]);

  function checkScroll() {
    const button = document.getElementById('sticky-button');
    if (!button) return;
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.body.offsetHeight;

    let diff = (documentHeight - scrollPosition) / documentHeight;
    if (diff > 0.3)
      button.style.opacity = '0';
    else {
      button.style.opacity = (1 - diff * 2).toString();
    }
  }
  document.addEventListener('scroll', function() {
    checkScroll();
  });

  function scrollDown(length: number) {
    window.scrollBy({
      top: length,
      behavior: 'smooth'
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-22">
      <div className="w-11/12 flex justify-center items-center min-h-[20vh] mb-20 border-b border-gray-200 mx-10">
        <h1 className="text-3xl">Users Connections</h1>
      </div>
      {loading && users.length == 0 && <p>Loading...</p>}
      {users.length != 0 &&
        <div className="flex flex-wrap gap-10 justify-center fade-in mb-10">
          {users.map((user: any) => (
            <Card key={user.id} className="w-3/12 shadow-md">
              <CardTitle className="px-4 pt-2 pb-0 text-xl flex items-center justify-between">
                <p>{user.name} {user.last_name}</p>
                <img src={`https://flagsapi.com/${user.location.country_code}/shiny/32.png`} alt="flag" />
              </CardTitle>
              <CardDescription className="px-4 mt-[-6px]">
                @{user.username}
              </CardDescription>
              <CardContent className="p-4 px-5 flex flex-col gap-4">
                <span className="flex items-center gap-2">
                  <CakeIcon />
                  <p>{user.dob.toString().split('T')[0]}</p>
                </span>
                <span className="flex items-center gap-2">
                  <PinMapIcon />
                  <p>{user.location.city}, {user.location.state}, {user.location.country}</p>
                </span>
                <span className="flex items-center gap-2">
                  <EnvelopeIcon />
                  <p>{user.email}</p>
                </span>

              </CardContent>
            </Card>
          ))}
        </div>
      }
      <div className="fixed bottom-0 flex justify-center w-full p-4">
        <button onClick={() => setPage(page + 1)} className="p-2 px-4 bg-primary text-white rounded-full shadow-lg" id="sticky-button">
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
