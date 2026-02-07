import { useState } from "react";

import Header from "../user/Header";
import Footer from "../../components/layout/Footer";
import Panel from "./Friends/Panel"
import AllFriendContent from "./Friends/AllFriendContent"
import RequestsContent from "./Friends/RequestsContent"
import SuggestionsContent from "./Friends/SuggestionsContent"

export default function Friends() {
  const [activeTab, setActiveTab] = useState(1);

  const list = [
    { id: 1, fullname: "John Doe", rando: "A7X9", nbr: 12 },
    { id: 2, fullname: "Sarah Smith", rando: "K2M4", nbr: 45 },
    { id: 3, fullname: "Ali Hassan", rando: "Z8Q1", nbr: 7 },
    { id: 4, fullname: "Emma Brown", rando: "P9L3", nbr: 30 },
    { id: 5, fullname: "Youssef Amine", rando: "R5T8", nbr: 99 },
    { id: 6, fullname: "Mohamed Salah", rando: "L8A2", nbr: 18 },
    { id: 7, fullname: "Lina Martin", rando: "Q4W7", nbr: 63 },
    { id: 8, fullname: "Omar Khalid", rando: "N3C9", nbr: 5 },
    { id: 9, fullname: "Sophia Wilson", rando: "B6R1", nbr: 27 },
    { id: 10, fullname: "Adam Lee", rando: "X9M4", nbr: 41 },
    { id: 11, fullname: "Nora Ahmed", rando: "T2K8", nbr: 56 },
    { id: 12, fullname: "Lucas Miller", rando: "F7Q5", nbr: 9 },
    { id: 13, fullname: "Hassan Rami", rando: "J1P6", nbr: 74 },
    { id: 14, fullname: "Emily Clark", rando: "D8Z3", nbr: 21 },
    { id: 15, fullname: "Yasmin Noor", rando: "S4H9", nbr: 88 },
    { id: 16, fullname: "David Johnson", rando: "M5L2", nbr: 34 },
    { id: 17, fullname: "Imane Zahra", rando: "U9A7", nbr: 11 },
    { id: 18, fullname: "Ryan Cooper", rando: "C3X8", nbr: 67 },
    { id: 19, fullname: "Anas Fathi", rando: "W6B4", nbr: 2 },
    { id: 20, fullname: "Olivia Taylor", rando: "E8N1", nbr: 50 },
    { id: 21, fullname: "Karim Benali", rando: "V9T5", nbr: 29 },
    { id: 22, fullname: "Mia Anderson", rando: "H2Q7", nbr: 91 },
    { id: 23, fullname: "Said El Amrani", rando: "Y4P8", nbr: 14 },
    { id: 24, fullname: "Daniel White", rando: "A6K3", nbr: 38 },
    { id: 25, fullname: "Fatima Zahra", rando: "R1M9", nbr: 60 },
    { id: 26, fullname: "Chris Evans", rando: "L7D2", nbr: 26 },
    { id: 27, fullname: "Ibrahim Nouri", rando: "S8C4", nbr: 83 },
    { id: 28, fullname: "Laura King", rando: "Q9F1", nbr: 47 },
    { id: 29, fullname: "Ayoub Karim", rando: "Z5E7", nbr: 16 },
    { id: 30, fullname: "James Scott", rando: "B4X9", nbr: 72 }
  ];
  return (
    <>
      <Header />
      <main className="pageFriends">
        <section>
          <Panel activeTab={activeTab} setActiveTab={setActiveTab} />
          { activeTab === 1 && <AllFriendContent data={list} /> }
          { activeTab === 2 && <RequestsContent data={list} /> }
          { activeTab === 3 && <SuggestionsContent data={list} /> }
        </section>

      </main>
      <Footer />
    </>
  );
}
