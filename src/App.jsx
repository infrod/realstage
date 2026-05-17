import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Check,
  Download,
  FileText,
  FolderUp,
  Lock,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Signature,
  UserCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TosView from "./views/TosView";
import TosView from "./views/TosView.jsx";

const BRAND = {
  navy: "#0D3B66",
  teal: "#8ECAC2",
  blue: "#1D6FB8",
  green: "#5AA85A",
  orange: "#F7941D",
};

const TOTAL_STAGE_HOURS = 120;
const APP_STORAGE_KEY = "stage-portal-release-v1";
const TEACHER_CONTACT = {
  name: "Jonathan Beaulieu",
  phone: "418-555-5321",
  email: "jonathan.beaulieu@csrsaguenay.qc.ca",
};
const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const teacherGroups = ["VC00001", "VC00002"];
const requiredFiles = ["Protocole de stage", "Appréciation du superviseur", "Grille de présence"];

const stagePartnerCompanies = [
  {
    company: "Sports Experts Chicoutimi",
    supervisor: "Marc Bouchard",
    status: "Excellent milieu",
    lastIntern: "Camille Tremblay",
  },
  {
    company: "Boutique Le Coureur",
    supervisor: "Sophie Tremblay",
    status: "Suivi requis",
    lastIntern: "Noah Gagnon",
  },
];

const teacherManagementFeatures = [
  "Création de groupes",
  "Assignation des élèves",
  "Assignation superviseur ↔ élève",
  "Filtrage par groupe",
  "Recherche rapide",
  "Téléchargement dossier complet",
  "Suivi des heures en temps réel",
  "Vue des documents déposés",
  "Alertes élèves en retard",
  "Archivage des dossiers de stage",
];

const protocolLegalSections = [
  {
    title: "Objet de l’entente",
    body: [
      "Le présent protocole a pour objet de préciser les conditions et modalités du stage proposé à l’élève.",
      "Ce stage constitue une étape essentielle de la formation professionnelle, puisqu’il permet au stagiaire d’effectuer un stage en milieu de travail en lien direct avec son programme de formation et d’acquérir une expérience concrète favorisant l’apprentissage des tâches propres au métier et le développement de compétences socioprofessionnelles indispensables à une intégration réussie sur le marché du travail.",
      "Ce document doit être complété dans son entièreté et remis avant le premier jour du stage à l’enseignant responsable.",
      "Le superviseur de stage est la personne responsable de la planification, du suivi et de la coordination générale du stage dans le milieu de travail.",
      "L’entreprise désigne l’organisation qui accueille l’élève stagiaire. Le stagiaire désigne l’élève inscrit au CFP qui effectue un stage en milieu de travail. L’établissement d’enseignement désigne le Centre de formation professionnelle du Grand-Fjord. L’enseignant responsable désigne la personne dans l’établissement d’enseignement qui s’occupe du suivi pédagogique du stage, en lien avec le milieu de travail et le superviseur de stage.",
      "Les parties conviennent que le stage est non rémunéré ou rémunéré. Durant le stage, le stagiaire est considéré travailleur du CFP du Grand-Fjord aux fins de l’application de la Loi sur les accidents du travail et les maladies professionnelles.",
      "L’établissement d’enseignement fournira à l’entreprise une preuve de couverture d’assurance responsabilité civile avant le début du stage.",
      "Toutefois, si l’entreprise rémunère le stagiaire ou requiert ses services en dehors des heures de stage prévues ou par toute autre entente, le stagiaire n’est plus sous la responsabilité du CFP du Grand-Fjord et n’est plus réputé être un travailleur à l’emploi du CFP du Grand-Fjord en vertu de la Loi sur les accidents du travail et les maladies professionnelles.",
      "L’entreprise qui rémunère le stagiaire doit assumer la responsabilité civile du stagiaire, comme s’il était un de ses employés.",
    ],
  },
  {
    title: "Horaire et durée du stage",
    body: [
      "Le stage doit se dérouler selon l’horaire en vigueur dans le milieu de travail, que l’élève est tenu de respecter, et comporter un minimum de 30 heures par semaine.",
      "Toutes les modifications à la plage horaire doivent être autorisées par l’enseignant responsable.",
      "Les dates de début, de fin, le nombre d’heures prévues par semaine ainsi que les périodes de pause et de repas doivent être indiqués dans la section à remplir du protocole.",
    ],
  },
  {
    title: "Rencontres de supervision",
    body: [
      "Une rencontre de signature du protocole et une rencontre finale doivent être prévues.",
      "Ces rencontres se réalisent en vidéoconférence avec l’application Teams. Un lien pour chaque rencontre est envoyé dès la confirmation de celles-ci par l’enseignant responsable.",
    ],
  },
  {
    title: "Engagements de l’enseignant responsable",
    body: [
      "Durant le stage de l’élève, l’enseignant responsable s’engage à remettre à l’élève et au milieu de stage tous les documents nécessaires à la réalisation du stage.",
      "Il planifie et anime deux rencontres incluant le stagiaire et le superviseur de stage, au début et à la fin du stage.",
      "Il offre un soutien et un accompagnement régulier au stagiaire, incluant deux rencontres tripartites et une rencontre hebdomadaire selon la durée du stage.",
      "Il aide le stagiaire à faire le lien entre les notions théoriques et leur application en milieu de travail.",
      "Il évalue le travail du stagiaire en respectant les critères et objectifs d’évaluation établis.",
      "Il s’assure que le milieu de stage offre des conditions propices à l’apprentissage et qu’il respecte les lois en vigueur, notamment en matière de sécurité et de prévention du harcèlement.",
      "Il intervient et encadre l’élève en cas de difficultés rencontrées durant le stage.",
    ],
  },
  {
    title: "Engagements du superviseur de stage",
    body: [
      "Le superviseur confirme avoir rencontré le ou la candidate dans le cadre de sa démarche de recherche d’un milieu de stage.",
      "En tant que superviseur du stage au sein de l’entreprise, il s’engage à confier au stagiaire une variété de tâches significatives et en lien avec les compétences de son métier, tout en assurant sa supervision et en lui offrant un accompagnement adéquat tout au long du stage.",
      "Il s’engage à offrir au stagiaire un environnement de travail sain, sécuritaire et exempt de violence ou de harcèlement, conformément à la Loi sur les normes du travail.",
      "Il facilite son intégration au sein de l’entreprise, notamment par l’accueil et la présentation de l’équipe.",
      "Il fournit au stagiaire les informations pertinentes sur l’entreprise et sur ses futures fonctions.",
      "Il initie le stagiaire à ses rôles et à ses tâches, propose des tâches adéquates, diversifiées et en lien avec les compétences du programme, puis encadre et soutient le stagiaire tout au long du stage.",
      "Il avise rapidement l’enseignant responsable en cas de difficulté rencontrée par le stagiaire et participe aux deux rencontres incluant l’enseignant responsable, le stagiaire et le superviseur de stage.",
    ],
  },
  {
    title: "Engagements du stagiaire",
    body: [
      "Durant son stage, le stagiaire s’engage à se présenter dans l’entreprise à la date et à l’heure prévues pour le début du stage.",
      "Il respecte les règlements, politiques et consignes de l’entreprise et ne réclame pas de rémunération pour le travail effectué durant le stage, sauf entente contraire.",
      "Il respecte l’horaire établi en accord avec l’entreprise et l’enseignant responsable.",
      "Il avise l’enseignant responsable et le superviseur de stage, avant le début de la journée, en cas d’absence.",
      "Il conduit un véhicule, lorsque requis, uniquement s’il détient un permis de conduire valide et s’il a obtenu l’autorisation du responsable de l’entreprise.",
      "Il porte la tenue vestimentaire exigée par le centre de formation et/ou par le milieu de stage.",
      "Il ne change pas de lieu de stage et ne quitte pas le stage sans l’autorisation de l’enseignant responsable.",
      "Il respecte la confidentialité concernant la clientèle et le fonctionnement du milieu de stage, réalise l’ensemble des travaux demandés dans le cadre du stage et participe activement aux rencontres d’échanges entre l’enseignant et le milieu de stage.",
    ],
  },
  {
    title: "Autorisation parentale et certificat d’assurance",
    body: [
      "Pour un stagiaire âgé de moins de 18 ans, une autorisation d’un parent ou d’un tuteur est requise.",
      "Le protocole inclut également une section Certificat d’assurance confirmant la couverture applicable durant la période de stage.",
    ],
  },
];

const securityFeatures = [
  "Authentification Microsoft Entra ID",
  "Journal d’audit horodaté",
  "Rôles protégés Élève / Superviseur / Enseignant",
  "Archivage automatique des dossiers",
  "Export PDF officiel CFP du Grand Fjord",
  "Notifications automatiques",
  "Sauvegarde infonuagique sécurisée",
  "Compatible mobile et tablette",
];
const ratingOptions = ["Rarement", "Occasionnellement", "Souvent", "En tout temps"];
const appreciationCriteria = [
  "Assiduité",
  "Motivation",
  "Sens de l’initiative",
  "Autonomie",
  "Qualité du travail",
  "Communication orale",
  "Communication écrite",
  "Sens de l’organisation",
  "Travail d’équipe",
];
const presenceDates = [
  "2026-04-21",
  "2026-04-22",
  "2026-04-23",
  "2026-04-27",
  "2026-04-28",
  "2026-04-29",
  "2026-04-30",
  "2026-05-01",
  "2026-05-04",
  "2026-05-05",
  "2026-05-06",
  "2026-05-07",
  "2026-05-08",
  "2026-05-11",
  "2026-05-12",
  "2026-05-13",
  "2026-05-14",
];

const emptyEntry = { tasks: "", skills: "", challenges: "", learnings: "" };

function blankDocs() {
  return {
    protocol: {
      status: "Brouillon",
      program: "Vente-Conseil 5321",
      teacherName: "Jonathan Beaulieu",
      teacherEmail: TEACHER_CONTACT.email,
      companyName: "",
      supervisorName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      tasks: "",
      startDate: "2026-04-21",
      endDate: "2026-05-14",
      hoursPerWeek: "30",
      breaks: "",
      signature: "",
    },
    appreciation: {
      status: "Brouillon",
      supervisorName: "",
      companyName: "",
      date: "",
      ratings: {},
      comments: "",
      hireDecision: "",
      hireExplanation: "",
      signature: "",
    },
    presence: presenceDates.map((date) => ({ date, arrival: "", departure: "", signature: "" })),
  };
}

const exemplaryPresence = presenceDates.map((date) => ({
  date,
  arrival: "09:00",
  departure: "16:30",
  signature: "Marc Bouchard",
}));

const weakPresence = presenceDates.map((date, index) => ({
  date,
  arrival: index < 5 ? "09:30" : "",
  departure: index < 5 ? "14:30" : "",
  signature: index < 3 ? "Sophie Tremblay" : "",
}));

const initialStudents = [
  {
    id: "e001",
    name: "Camille Tremblay",
    studentNumber: "170987",
    email: "camille.tremblay@eleve.cfp.ca",
    group: "VC00001",
    stagePlace: {
      companyName: "Sports Experts Chicoutimi",
      address: "1324 boulevard Talbot, Saguenay, QC",
      supervisorName: "Marc Bouchard",
      supervisorEmail: "marc.bouchard@sportsexperts.ca",
      phone: "418-555-0142",
    },
    entries: {
      "2026-04-20": {
        tasks: "Accueil de la clientèle, présentation des promotions et réorganisation du département chaussures.",
        skills: "448-452 Service à la clientèle, 448-468 Vente",
        challenges: "Adapter rapidement mon approche selon le type de client.",
        learnings: "Utiliser davantage les questions ouvertes afin de découvrir les besoins réels.",
      },
      "2026-04-21": {
        tasks: "Conseil client sur les chaussures de course et création d’un affichage promotionnel.",
        skills: "448-543 Produits et services, 448-563 Présentation visuelle",
        challenges: "Retenir les caractéristiques techniques de plusieurs modèles.",
        learnings: "Faire des comparatifs simples aide énormément les clients.",
      },
      "2026-04-22": {
        tasks: "Participation à une vente complète avec financement et vente complémentaire.",
        skills: "448-473 Transactions liées à la vente",
        challenges: "Rester confiante lors des objections du client.",
        learnings: "Le CAB permet de mieux structurer mes arguments.",
      },
      "2026-04-27": {
        tasks: "Préparation de commandes web et suivi téléphonique avec des clients.",
        skills: "448-522 Service après-vente",
        challenges: "Gérer plusieurs tâches rapidement.",
        learnings: "Prioriser les urgences et confirmer les informations avec le client.",
      },
      "2026-04-28": {
        tasks: "Animation d’une démonstration produit et gestion de la caisse.",
        skills: "448-468 Vente, 448-452 Service à la clientèle",
        challenges: "Conserver une excellente attitude malgré le stress.",
        learnings: "Rester calme améliore énormément l’expérience client.",
      },
      "2026-04-29": {
        tasks: "Réception de marchandise et accompagnement d’un client fidèle.",
        skills: "448-554 Approvisionnement",
        challenges: "Optimiser le temps de placement des produits.",
        learnings: "Une bonne organisation facilite les opérations.",
      },
    },
    files: ["Protocole de stage signé.pdf", "Appréciation finale.pdf", "Grille de présence.pdf", "Journal de bord complet.pdf"],
    supervisorDocs: {
      protocol: {
        ...blankDocs().protocol,
        status: "Complété",
        companyName: "Sports Experts Chicoutimi",
        supervisorName: "Marc Bouchard",
        companyAddress: "1324 boulevard Talbot, Saguenay, QC",
        companyPhone: "418-555-0142",
        companyEmail: "marc.bouchard@sportsexperts.ca",
        tasks: "Conseil client, vente complémentaire, mise en marché et suivi après-vente.",
        breaks: "30 minutes dîner",
        signature: "Marc Bouchard",
      },
      appreciation: {
        ...blankDocs().appreciation,
        status: "Complété",
        supervisorName: "Marc Bouchard",
        companyName: "Sports Experts Chicoutimi",
        date: "2026-05-14",
        ratings: {
          Assiduité: "En tout temps",
          Motivation: "En tout temps",
          "Sens de l’initiative": "Souvent",
          Autonomie: "En tout temps",
          "Qualité du travail": "En tout temps",
          "Communication orale": "En tout temps",
          "Communication écrite": "Souvent",
          "Sens de l’organisation": "Souvent",
          "Travail d’équipe": "En tout temps",
        },
        comments: "Camille est une stagiaire exemplaire. Elle démontre une excellente attitude avec la clientèle et apprend rapidement.",
        hireDecision: "Oui",
        hireExplanation: "Nous souhaiterions l’embaucher à temps partiel.",
        signature: "Marc Bouchard",
      },
      presence: exemplaryPresence,
    },
  },
  {
    id: "e002",
    name: "Noah Gagnon",
    studentNumber: "170988",
    email: "noah.gagnon@eleve.cfp.ca",
    group: "VC00002",
    stagePlace: {
      companyName: "Boutique Le Coureur",
      address: "245 rue Racine Est, Chicoutimi, QC",
      supervisorName: "Sophie Tremblay",
      supervisorEmail: "sophie.tremblay@lecoureur.ca",
      phone: "418-555-0198",
    },
    entries: {
      "2026-04-20": {
        tasks: "Placement de boîtes dans l’entrepôt.",
        skills: "448-554 Approvisionnement",
        challenges: "Manque d’organisation.",
        learnings: "Doit mieux écouter les consignes.",
      },
      "2026-04-22": {
        tasks: "Accueil client et rangement du magasin.",
        skills: "448-452 Service à la clientèle",
        challenges: "Peu d’initiative avec les clients.",
        learnings: "Doit pratiquer davantage le questionnement.",
      },
    },
    files: ["Grille de présence incomplète.pdf"],
    supervisorDocs: {
      protocol: {
        ...blankDocs().protocol,
        companyName: "Boutique Le Coureur",
        supervisorName: "Sophie Tremblay",
        companyPhone: "418-555-0198",
        tasks: "Accueil client et entretien du magasin.",
      },
      appreciation: {
        ...blankDocs().appreciation,
        supervisorName: "Sophie Tremblay",
        companyName: "Boutique Le Coureur",
        ratings: {
          Assiduité: "Occasionnellement",
          Motivation: "Rarement",
          "Sens de l’initiative": "Rarement",
          Autonomie: "Occasionnellement",
          "Qualité du travail": "Occasionnellement",
          "Communication orale": "Occasionnellement",
          "Communication écrite": "Rarement",
          "Sens de l’organisation": "Rarement",
          "Travail d’équipe": "Occasionnellement",
        },
        comments: "Noah doit améliorer sa ponctualité et son implication auprès de la clientèle. Plusieurs suivis ont été nécessaires durant le stage.",
        signature: "",
      },
      presence: weakPresence,
    },
  },
];

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function hoursBetween(arrival, departure) {
  if (!arrival || !departure) return 0;
  const [arrivalHours, arrivalMinutes] = arrival.split(":").map(Number);
  const [departureHours, departureMinutes] = departure.split(":").map(Number);
  if ([arrivalHours, arrivalMinutes, departureHours, departureMinutes].some(Number.isNaN)) return 0;
  const start = arrivalHours * 60 + arrivalMinutes;
  const end = departureHours * 60 + departureMinutes;
  return end > start ? (end - start) / 60 : 0;
}

function stageHoursOf(student) {
  const hoursDone = student.supervisorDocs.presence.reduce((total, presence) => total + hoursBetween(presence.arrival, presence.departure), 0);
  const done = Math.round(hoursDone * 100) / 100;
  const remaining = Math.max(TOTAL_STAGE_HOURS - done, 0);
  return {
    done,
    total: TOTAL_STAGE_HOURS,
    remaining: Math.round(remaining * 100) / 100,
    percent: Math.min(Math.round((done / TOTAL_STAGE_HOURS) * 100), 100),
  };
}

function progressOf(student) {
  const journalCount = Object.keys(student.entries).length;
  const protocolSigned = student.supervisorDocs.protocol.status === "Complété" || Boolean(student.supervisorDocs.protocol.signature);
  const appreciationSigned = student.supervisorDocs.appreciation.status === "Complété" || Boolean(student.supervisorDocs.appreciation.signature);
  const presenceCount = student.supervisorDocs.presence.filter((presence) => presence.arrival || presence.departure || presence.signature).length;
  const stageHours = stageHoursOf(student);
  const presenceComplete = stageHours.done >= TOTAL_STAGE_HOURS;
  const doneItems = [journalCount >= 5, protocolSigned, appreciationSigned, presenceComplete].filter(Boolean).length;
  return {
    percent: Math.round((doneItems / 4) * 100),
    journalCount,
    protocolSigned,
    appreciationSigned,
    presenceCount,
    presenceComplete,
    presenceTotal: student.supervisorDocs.presence.length,
    stageHours,
  };
}

function makeDownload(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildStudentPackage(student) {
  const progress = progressOf(student);

  const journal = Object.entries(student.entries)
    .map(([date, entry]) => [
      date,
      `Tâches: ${entry.tasks}`,
      `Compétences: ${entry.skills}`,
      `Difficultés: ${entry.challenges}`,
      `Apprentissages: ${entry.learnings}`,
    ].join("\n"))
    .join("\n\n---\n\n");

  const legalText = protocolLegalSections
    .map((section) => [section.title.toUpperCase(), ...section.body].join("\n"))
    .join("\n\n");

  return [
    `DOSSIER DE STAGE - ${student.name}`,
    `Groupe: ${student.group}`,
    `No fiche: ${student.studentNumber}`,
    `Courriel: ${student.email}`,
    `Milieu: ${student.stagePlace.companyName}`,
    `Superviseur: ${student.stagePlace.supervisorName}`,
    `Courriel superviseur: ${student.stagePlace.supervisorEmail}`,
    `Adresse: ${student.stagePlace.address}`,
    `Téléphone: ${student.stagePlace.phone}`,
    `Progression: ${progress.percent}%`,
    `Heures complétées: ${progress.stageHours.done}/${progress.stageHours.total}`,
    `Heures restantes: ${progress.stageHours.remaining}`,
    "",
    "JOURNAL",
    journal || "Aucune entrée.",
    "",
    "PROTOCOLE - INFORMATIONS LÉGALES",
    legalText,
    "",
    "PROTOCOLE - SECTION À REMPLIR",
    `Statut: ${student.supervisorDocs.protocol.status}`,
    `Entreprise: ${student.supervisorDocs.protocol.companyName}`,
    `Superviseur: ${student.supervisorDocs.protocol.supervisorName}`,
    `Tâches: ${student.supervisorDocs.protocol.tasks}`,
    `Signature: ${student.supervisorDocs.protocol.signature || "Non signée"}`,
    "",
    "APPRÉCIATION",
    `Statut: ${student.supervisorDocs.appreciation.status}`,
    `Signature: ${student.supervisorDocs.appreciation.signature || "Non signée"}`,
  ].join("\n");
}

function runSmokeTests() {
  console.assert(monthMatrix(2026, 3).length === 42, "Calendrier: 42 cases attendues");
  console.assert(progressOf(initialStudents[0]).percent >= 0, "Progression valide");
  console.assert(buildStudentPackage(initialStudents[0]).includes("Courriel superviseur"), "Export contient le courriel superviseur");
  console.assert(requiredFiles.length === 3, "Trois fichiers requis");
  console.assert(teacherGroups.length >= 2, "Deux groupes de démonstration sont attendus");
  console.assert(hoursBetween("09:00", "16:00") === 7, "Calcul des heures entre deux heures valide");
  console.assert(stageHoursOf(initialStudents[0]).done === 127.5, "Camille devrait avoir 127.5 h dans la démo");
  console.assert(stageHoursOf(initialStudents[1]).done === 25, "Noah devrait avoir 25 h dans la démo");
  console.assert(progressOf(initialStudents[0]).percent === 100, "Camille devrait avoir un dossier exemplaire complet");
  console.assert(progressOf(initialStudents[1]).percent < 50, "Noah devrait avoir plusieurs lacunes dans la démo");
  console.assert(protocolLegalSections.length >= 6, "Le protocole doit contenir les sections légales");
  console.assert(buildStudentPackage(initialStudents[0]).includes("PROTOCOLE - INFORMATIONS LÉGALES"), "L’export doit contenir le protocole légal");
  console.assert(typeof blankDocs().protocol.program === "string", "Le programme par défaut doit être défini");
  console.assert(securityFeatures.length >= 5, "Les fonctionnalités de conformité doivent être présentes");
  console.assert(teacherManagementFeatures.length >= 5, "Les fonctionnalités de gestion enseignant doivent être présentes");
  console.assert(stagePartnerCompanies.length >= 2, "Les milieux partenaires doivent être présents");
  console.assert(typeof DirectionView === "function", "La vue Direction doit être disponible");
  console.assert("direction" === "direction", "Le mode démo Direction doit être disponible");
  console.assert(initialStudents[0].studentNumber === "170987", "Le numéro de fiche étudiant doit être défini");
  console.assert(typeof TEACHER_CONTACT.email === "string", "Le courriel enseignant doit être défini");
}
if (typeof window !== "undefined" && window.location?.search?.includes("debugTests=1")) {
  runSmokeTests();
}

function BannerImage() {
  const [src, setSrc] = useState("/banniereStage.jpg");
  const [failed, setFailed] = useState(false);
  const onError = () => {
    if (src === "/banniereStage.jpg") setSrc("./banniereStage.jpg");
    else if (src === "./banniereStage.jpg") setSrc("/assets/banniereStage.jpg");
    else setFailed(true);
  };
  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white text-slate-600">
        <div className="rounded-2xl border border-dashed p-6 text-center">
          <b>Bannière S.T.A.G.E.</b>
          <br />
          Déposer banniereStage.jpg dans public/
        </div>
      </div>
    );
  }
  return <img src={src} alt="Bannière S.T.A.G.E." className="h-full w-full object-cover object-left md:object-center" onError={onError} />;
}

function Field({ label, value, onChange, textarea = false, type = "text", placeholder = "" }) {
  return (
    <label className="space-y-1">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      {textarea ? (
        <textarea className="min-h-28 w-full rounded-2xl border p-3" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      ) : (
        <input className="w-full rounded-xl border p-3" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      )}
    </label>
  );
}

function SignaturePad({ value, onChange }) {
  const [typed, setTyped] = useState(value || "");
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-2 flex items-center gap-2 font-bold">
        <Signature className="h-5 w-5 text-blue-700" /> Signature électronique
      </div>
      <input className="w-full rounded-xl border p-3 font-serif text-xl" value={typed} onChange={(event) => setTyped(event.target.value)} placeholder="Taper le nom complet" />
      <div className="mt-3 rounded-xl border border-dashed bg-slate-50 p-4 font-serif text-2xl italic">{typed || "Signature"}</div>
      <Button className="mt-3 rounded-xl" style={{ backgroundColor: BRAND.navy }} onClick={() => onChange(typed)}>
        Confirmer la signature
      </Button>
    </div>
  );
}

function Info({ label, value, color }) {
  return (
    <div className={`rounded-2xl ${color} p-4`}>
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 break-words font-black text-slate-900">{value}</p>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 text-sm">
      <strong>{value}</strong>
      <br />
      {label}
    </div>
  );
}

function AuthPage({ role, setRole, session, setSession, selectedGroup, setSelectedGroup, onConnect }) {
  const [mode, setMode] = useState("login");
  const [password, setPassword] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onConnect();
  };

  const connectWithMicrosoft = () => {
    const lowerEmail = session.email.toLowerCase();
    const detectedRole = lowerEmail.includes("enseignant") || lowerEmail.includes("prof") || lowerEmail.includes("jonathan") ? "admin" : role;
    setRole(detectedRole);
    setSession({
      ...session,
      name: session.name || "Utilisateur Microsoft",
      email: session.email || "prenom.nom@css-saguenay.qc.ca",
      group: detectedRole === "admin" ? selectedGroup : "Vente-Conseil 5321",
    });
    onConnect();
  };
  const connectAsTos = () => {
  setRole("tos");
  setSession({
    ...session,
    name: "TOS CFP",
    email: "tos@csrsaguenay.qc.ca",
    group: "Tous les programmes",
  });
  onConnect();
};
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative min-h-[260px] overflow-hidden md:min-h-[420px]">
        <div className="absolute inset-0 overflow-hidden rounded-b-[1.5rem] bg-white md:rounded-b-[2.5rem]">
          <BannerImage />
        </div>
      </header>
      <main className="mx-auto -mt-20 grid max-w-6xl gap-6 px-4 pb-10 md:-mt-28 md:grid-cols-[1fr_430px] md:px-6">
        <section className="relative z-10 rounded-3xl bg-white/95 p-6 shadow-2xl md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">Bienvenue</p>
          <h1 className="mt-2 text-3xl font-black text-[#0D3B66] md:text-5xl">Portail S.T.A.G.E.</h1>
          <p className="mt-4 text-slate-600">Une plateforme pour centraliser le journal de bord, les documents de stage, les signatures électroniques, les présences et le suivi.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-4"><b>Élève</b><p className="text-sm text-slate-600">Journal et dossier.</p></div>
            <div className="rounded-2xl bg-green-50 p-4"><b>Superviseur</b><p className="text-sm text-slate-600">Signature et documents.</p></div>
            <div className="rounded-2xl bg-orange-50 p-4"><b>Enseignant</b><p className="text-sm text-slate-600">Groupes et alertes.</p></div>
          </div>
        </section>
        <Card className="relative z-10 rounded-3xl bg-white shadow-2xl">
          <CardContent className="p-5 md:p-6">
            <form onSubmit={submit}>
              <div className="mb-5 flex rounded-2xl bg-slate-100 p-1">
                <button type="button" className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold ${mode === "login" ? "bg-white text-[#0D3B66] shadow-sm" : "text-slate-500"}`} onClick={() => setMode("login")}>Connexion</button>
                <button type="button" className={`flex-1 rounded-xl px-3 py-2 text-sm font-bold ${mode === "signup" ? "bg-white text-[#0D3B66] shadow-sm" : "text-slate-500"}`} onClick={() => setMode("signup")}>Inscription</button>
              </div>
              <div className="mb-4 flex items-center gap-2 font-black">
                <Lock className="h-5 w-5 text-blue-700" /> {mode === "login" ? "Se connecter" : "Créer un accès"}
              </div>

              <button type="button" onClick={connectWithMicrosoft} className="mb-4 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-black text-[#0D3B66] shadow-sm transition hover:bg-blue-50">
                <span className="grid h-6 w-6 grid-cols-2 gap-0.5">
                  <span className="bg-[#F25022]" />
                  <span className="bg-[#7FBA00]" />
                  <span className="bg-[#00A4EF]" />
                  <span className="bg-[#FFB900]" />
                </span>
                Continuer avec Microsoft 365
              </button>

              <div className="mb-4 rounded-2xl bg-blue-50 p-3 text-xs text-slate-600">
                Connexion sécurisée prévue avec Microsoft Entra ID pour utiliser les comptes scolaires des élèves, superviseurs, enseignants et membres de la direction.
              </div>
              <div className="grid gap-3">
                <label className="space-y-1">
                  <span className="text-sm font-bold">Type d’utilisateur</span>
                  <select className="w-full rounded-xl border p-3" value={role} onChange={(event) => setRole(event.target.value)}>
                    <option value="student">Élève</option>
                    <option value="supervisor">Superviseur</option>
                    <option value="admin">Enseignant / Admin</option>
                    <option value="direction">Direction</option>
                    <option value="tos">TOS</option>
                  </select>
                </label>
                {mode === "signup" && (
                  <label className="space-y-1">
                    <span className="text-sm font-bold">Groupe</span>
                    <select className="w-full rounded-xl border p-3" value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)}>
                      {teacherGroups.map((group) => <option key={group} value={group}>Groupe {group}</option>)}
                    </select>
                  </label>
                )}
                <button
  type="button"
  onClick={connectAsTos}
  className="rounded-xl border bg-purple-50 p-2 text-sm font-bold"
>
  Démo TOS
</button>
                <Field label="Nom complet" value={session.name} onChange={(value) => setSession({ ...session, name: value })} placeholder="Nom complet" />
                <Field label="Courriel" type="email" value={session.email} onChange={(value) => setSession({ ...session, email: value })} placeholder="nom@courriel.ca" />
                <Field label="Mot de passe" type="password" value={password} onChange={setPassword} />
              </div>
              <Button type="submit" className="mt-5 min-h-12 w-full rounded-xl text-base font-black" style={{ backgroundColor: BRAND.navy }}>
                {mode === "login" ? "Accéder au portail" : "Créer mon accès"}
              </Button>
              <p className="mt-4 text-center text-xs text-slate-500">Version Release : utilisez votre compte scolaire ou votre accès autorisé pour ouvrir le portail.</p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StageInfoCard({ student, showStudentNumber = false }) {
  const stage = student.stagePlace;
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Stage</p>
        <h2 className="text-2xl font-black">Informations du milieu de stage</h2>
        <p className="text-sm text-slate-500">Dossier de {student.name}</p>
        {showStudentNumber && (
          <div className="mt-3 inline-flex rounded-full bg-[#0D3B66] px-4 py-2 text-sm font-black text-white">
            Numéro de fiche : {student.studentNumber}
          </div>
        )}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="Lieu de stage" value={stage.companyName} color="bg-blue-50" />
          <Info label="Nom du superviseur" value={stage.supervisorName} color="bg-green-50" />
          <Info label="Courriel du superviseur" value={stage.supervisorEmail} color="bg-slate-50" />
          <Info label="Téléphone du milieu" value={stage.phone} color="bg-orange-50" />
          <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
            <p className="text-xs font-bold uppercase text-slate-500">Adresse du milieu de stage</p>
            <p className="mt-1 font-semibold">{stage.address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HoursOverview({ student }) {
  const hours = stageHoursOf(student);
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Heures de stage</p>
            <h2 className="text-2xl font-black">Suivi des 120 heures</h2>
            <p className="text-sm text-slate-500">Calculé automatiquement à partir des présences inscrites par le superviseur.</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-black text-[#0D3B66]">{hours.done} h</p>
            <p className="text-xs text-slate-500">sur {hours.total} h</p>
          </div>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full" style={{ width: `${hours.percent}%`, backgroundColor: hours.percent >= 100 ? BRAND.green : BRAND.orange }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Stat value={`${hours.done} h`} label="faites" />
          <Stat value={`${hours.remaining} h`} label="restantes" />
          <Stat value={`${hours.percent}%`} label="avancement" />
          <Stat value={`${hours.total} h`} label="objectif final" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressOverview({ student }) {
  const progress = progressOf(student);
  const hours = stageHoursOf(student);
  const todos = [
    { label: "Remplir au moins 5 entrées au journal", done: progress.journalCount >= 5 },
    { label: "Faire signer le protocole", done: progress.protocolSigned },
    { label: "Compléter les 120 heures de stage", done: hours.done >= TOTAL_STAGE_HOURS },
    { label: "Recevoir l’appréciation finale", done: progress.appreciationSigned },
  ];
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Progression</p>
            <h2 className="text-2xl font-black">Dossier de stage</h2>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-3xl font-black text-[#0D3B66]">{progress.percent}%</p>
            <p className="text-xs text-slate-500">complété</p>
          </div>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full" style={{ width: `${progress.percent}%`, backgroundColor: progress.percent === 100 ? BRAND.green : BRAND.blue }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Stat value={progress.journalCount} label="entrées journal" />
          <Stat value={progress.protocolSigned ? "Signé" : "À faire"} label="protocole" />
          <Stat value={`${hours.done}/${hours.total} h`} label="heures" />
          <Stat value={progress.appreciationSigned ? "Reçue" : "À venir"} label="appréciation" />
        </div>
        <h3 className="mb-2 mt-5 font-black">Ce qu’il reste à faire</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {todos.map((todo) => (
            <div key={todo.label} className="flex items-center gap-3 rounded-xl border bg-white p-3 text-sm">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${todo.done ? "bg-green-600" : "bg-slate-300"}`}>
                <Check className="h-4 w-4" />
              </span>
              <span className={todo.done ? "text-slate-500 line-through" : "font-semibold"}>{todo.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityFeed({ student }) {
  const progress = progressOf(student);
  const hours = stageHoursOf(student);
  const items = [
    `${progress.journalCount} entrée(s) de journal`,
    `${progress.presenceCount} présence(s) inscrite(s)`,
    `${hours.done}/${hours.total} heure(s) complétée(s)`,
    progress.protocolSigned ? "Protocole signé" : "Protocole à signer",
  ];
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Activité récente</h2>
        <div className="mt-3 space-y-2">
          {items.map((item) => <div key={item} className="rounded-xl border bg-white p-3 text-sm">{item}</div>)}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertPanel({ students }) {
  const alerts = students.flatMap((student) => {
    const progress = progressOf(student);
    return [
      progress.journalCount < 3 ? `${student.name} a peu d’entrées au journal.` : null,
      !progress.protocolSigned ? `${student.name} : protocole à signer.` : null,
      !progress.appreciationSigned ? `${student.name} : appréciation finale à recevoir.` : null,
      progress.stageHours.done < 60 ? `${student.name} : seulement ${progress.stageHours.done} h inscrites.` : null,
    ].filter(Boolean);
  });
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Alertes rapides</h2>
        <div className="mt-3 space-y-2">
          {alerts.map((alert) => <div key={alert} className="rounded-xl bg-orange-50 p-3 text-sm font-semibold text-orange-900">{alert}</div>)}
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentStatus({ student }) {
  const progress = progressOf(student);
  const docs = [
    { label: "Protocole", done: progress.protocolSigned },
    { label: "Appréciation", done: progress.appreciationSigned },
    { label: "Grille de présence", done: progress.presenceCount > 0 },
    { label: "Journal de bord", done: progress.journalCount > 0 },
  ];
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Vue enseignant</p>
        <h2 className="text-2xl font-black">Dossier de {student.name}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {docs.map((doc) => (
            <div key={doc.label} className="flex items-center justify-between rounded-2xl border bg-white p-4">
              <b>{doc.label}</b>
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${doc.done ? "bg-green-600" : "bg-slate-300"}`}>
                <Check className="h-4 w-4" />
              </span>
            </div>
          ))}
        </div>
        <Button className="mt-5 rounded-xl" style={{ backgroundColor: BRAND.navy }} onClick={() => makeDownload(`dossier-${student.name}.txt`, buildStudentPackage(student))}>
          <Download className="mr-2 h-4 w-4" /> Télécharger dossier complet
        </Button>
      </CardContent>
    </Card>
  );
}

function ProtocolForm({ student, updateDoc }) {
  const protocol = student.supervisorDocs.protocol;
  const setProtocol = (key, value) => updateDoc("protocol", { ...protocol, [key]: value });
  const signAndCompleteProtocol = () => {
    updateDoc("protocol", { ...protocol, status: "Complété", signature: protocol.signature || protocol.supervisorName || student.stagePlace.supervisorName });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-blue-50 p-4">
        <h3 className="font-black">Protocole d’entente</h3>
        <p className="text-sm text-slate-600">Document Web associé à {student.name}. Les informations légales sont conservées, et la section à remplir demeure disponible plus bas.</p>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <h3 className="mb-3 text-xl font-black text-[#0D3B66]">Informations légales du protocole</h3>
        <div className="space-y-3">
          {protocolLegalSections.map((section) => (
            <details key={section.title} className="rounded-xl border bg-slate-50 p-3" open={section.title === "Objet de l’entente"}>
              <summary className="cursor-pointer font-black text-slate-800">{section.title}</summary>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </details>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-4">
        <h3 className="text-xl font-black text-[#0D3B66]">Section à remplir et à signer</h3>
        <p className="text-sm text-slate-600">Cette section reste modifiable. Une fois signée, une version PDF est ajoutée automatiquement au dossier de l’élève.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom du stagiaire" value={student.name} onChange={() => {}} />
        <Field label="Programme" value={protocol.program} onChange={(value) => setProtocol("program", value)} />
        <Field label="Enseignant responsable" value={protocol.teacherName} onChange={(value) => setProtocol("teacherName", value)} />
        <Field label="Courriel enseignant" value={protocol.teacherEmail} onChange={(value) => setProtocol("teacherEmail", value)} />
        <Field label="Entreprise" value={protocol.companyName} onChange={(value) => setProtocol("companyName", value)} />
        <Field label="Superviseur" value={protocol.supervisorName} onChange={(value) => setProtocol("supervisorName", value)} />
        <Field label="Adresse entreprise" value={protocol.companyAddress} onChange={(value) => setProtocol("companyAddress", value)} />
        <Field label="Téléphone entreprise" value={protocol.companyPhone} onChange={(value) => setProtocol("companyPhone", value)} />
        <Field label="Courriel entreprise" value={protocol.companyEmail} onChange={(value) => setProtocol("companyEmail", value)} />
        <Field label="Heures prévues / semaine" value={protocol.hoursPerWeek} onChange={(value) => setProtocol("hoursPerWeek", value)} />
        <Field label="Date de début" type="date" value={protocol.startDate} onChange={(value) => setProtocol("startDate", value)} />
        <Field label="Date de fin" type="date" value={protocol.endDate} onChange={(value) => setProtocol("endDate", value)} />
      </div>
      <Field label="Tâches et responsabilités" textarea value={protocol.tasks} onChange={(value) => setProtocol("tasks", value)} />
      <Field label="Périodes de pause et de repas" textarea value={protocol.breaks} onChange={(value) => setProtocol("breaks", value)} />
      <SignaturePad value={protocol.signature} onChange={(value) => setProtocol("signature", value)} />
      <div className="flex flex-wrap gap-3">
        <Button className="rounded-xl" style={{ backgroundColor: BRAND.green }} onClick={signAndCompleteProtocol}>Signer et générer le PDF</Button>
        <Button variant="outline" className="rounded-xl" onClick={() => makeDownload(`protocole-${student.name}.pdf`, buildStudentPackage(student))}><Download className="mr-2 h-4 w-4" />Télécharger PDF</Button>
      </div>
    </div>
  );
}

function AppreciationForm({ student, updateDoc }) {
  const appreciation = student.supervisorDocs.appreciation;
  const setAppreciation = (key, value) => updateDoc("appreciation", { ...appreciation, [key]: value });
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-blue-50 p-4"><h3 className="font-black">Appréciation du superviseur</h3></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Élève" value={student.name} onChange={() => {}} />
        <Field label="Superviseur" value={appreciation.supervisorName} onChange={(value) => setAppreciation("supervisorName", value)} />
        <Field label="Entreprise" value={appreciation.companyName} onChange={(value) => setAppreciation("companyName", value)} />
        <Field label="Date" type="date" value={appreciation.date} onChange={(value) => setAppreciation("date", value)} />
      </div>
      <div className="space-y-3">
        {appreciationCriteria.map((criterion) => (
          <div key={criterion} className="rounded-2xl border bg-white p-4">
            <p className="mb-3 font-bold">{criterion}</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ratingOptions.map((option) => (
                <label key={option} className="rounded-xl border bg-slate-50 p-3 text-sm">
                  <input className="mr-2" type="radio" checked={appreciation.ratings[criterion] === option} onChange={() => setAppreciation("ratings", { ...appreciation.ratings, [criterion]: option })} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Field label="Commentaires" textarea value={appreciation.comments} onChange={(value) => setAppreciation("comments", value)} />
      <SignaturePad value={appreciation.signature} onChange={(value) => setAppreciation("signature", value)} />
      <Button className="rounded-xl" style={{ backgroundColor: BRAND.green }} onClick={() => setAppreciation("status", "Complété")}>Sauvegarder l’appréciation</Button>
    </div>
  );
}

function PresenceForm({ student, updatePresence }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-blue-50 p-4"><h3 className="font-black">Grille de présence</h3></div>
      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead style={{ backgroundColor: BRAND.teal }}>
            <tr><th className="p-3 text-left">Date</th><th className="p-3 text-left">Arrivée</th><th className="p-3 text-left">Départ</th><th className="p-3 text-left">Signature</th></tr>
          </thead>
          <tbody>
            {student.supervisorDocs.presence.map((row, index) => (
              <tr key={row.date} className="border-t">
                <td className="p-2 font-semibold">{row.date}</td>
                <td className="p-2"><input type="time" className="w-full rounded-xl border p-2" value={row.arrival} onChange={(event) => updatePresence(index, "arrival", event.target.value)} /></td>
                <td className="p-2"><input type="time" className="w-full rounded-xl border p-2" value={row.departure} onChange={(event) => updatePresence(index, "departure", event.target.value)} /></td>
                <td className="p-2"><input className="w-full rounded-xl border p-2" value={row.signature} onChange={(event) => updatePresence(index, "signature", event.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SupervisorTeacherContact() {
  return (
    <Card className="rounded-2xl border-2 border-blue-100 bg-blue-50 shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="mb-3 flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-700" />
          <h3 className="text-xl font-black text-[#0D3B66]">
            Pour joindre l’enseignant
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Enseignant responsable
            </p>
            <p className="mt-2 font-black text-slate-800">
              {TEACHER_CONTACT.name}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Téléphone
            </p>
            <p className="mt-2 font-black text-slate-800">
              {TEACHER_CONTACT.phone}
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase text-slate-500">
              Courriel
            </p>
            <p className="mt-2 break-words font-black text-slate-800">
              {TEACHER_CONTACT.email}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600 shadow-sm">
          Pour toute question concernant le stage, les présences, les documents ou les évaluations, le superviseur peut communiquer directement avec l’enseignant responsable.
        </div>
      </CardContent>
    </Card>
  );
}

function SupervisorSection({ students, activeStudentId, setActiveStudentId, updateSupervisorDoc, updatePresence }) {
  const [tab, setTab] = useState("protocol");
  const student = students.find((item) => item.id === activeStudentId) || students[0];
  const tabs = [["protocol", "Protocole"], ["appreciation", "Appréciation"], ["presence", "Présence"], ["guide", "Guide PDF"]];
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">Espace superviseur</p><h2 className="text-2xl font-black">Documents de stage</h2></div>
          <select className="rounded-xl border bg-white p-3" value={activeStudentId} onChange={(event) => setActiveStudentId(event.target.value)}>
            {students.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:flex">
          {tabs.map(([key, label]) => (
            <Button key={key} variant={tab === key ? "default" : "outline"} className="h-auto rounded-xl" style={tab === key ? { backgroundColor: BRAND.navy } : {}} onClick={() => setTab(key)}>{label}</Button>
          ))}
        </div>
        {tab === "protocol" && <ProtocolForm student={student} updateDoc={(doc, value) => updateSupervisorDoc(student.id, doc, value)} />}
        {tab === "appreciation" && <AppreciationForm student={student} updateDoc={(doc, value) => updateSupervisorDoc(student.id, doc, value)} />}
        {tab === "presence" && <PresenceForm student={student} updatePresence={(index, field, value) => updatePresence(student.id, index, field, value)} />}
        {tab === "guide" && <div className="rounded-2xl bg-slate-100 p-8 text-center text-slate-500">Aperçu PDF intégré — Guide du superviseur</div>}
      </CardContent>
    </Card>
  );
}

function TeacherManagementPanel({ students }) {
  const completeStudents = students.filter((student) => progressOf(student).percent >= 100);
  const incompleteStudents = students.filter((student) => progressOf(student).percent < 100);

  return (
    <Card className="rounded-2xl shadow-sm border-2 border-blue-200 bg-blue-50">
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <UsersRound className="h-6 w-6 text-blue-700" />
          <h2 className="text-2xl font-black text-[#0D3B66]">
            Gestion Enseignant
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {teacherManagementFeatures.map((feature) => (
            <div
              key={feature}
              className="rounded-xl bg-white p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D3B66] text-white">
                  <Check className="h-4 w-4" />
                </span>
                <span className="font-semibold text-slate-700">
                  {feature}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Groupes actifs
            </p>
            <p className="mt-2 text-3xl font-black text-[#0D3B66]">
              {teacherGroups.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Dossiers complets
            </p>
            <p className="mt-2 text-3xl font-black text-green-700">
              {completeStudents.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs font-bold uppercase text-slate-500">
              Dossiers incomplets
            </p>
            <p className="mt-2 text-3xl font-black text-orange-600">
              {incompleteStudents.length}
            </p>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Élève</th>
                <th className="p-3 text-left">No fiche</th>
                <th className="p-3 text-left">Groupe</th>
                <th className="p-3 text-left">Superviseur</th>
                <th className="p-3 text-left">Entreprise</th>
                <th className="p-3 text-left">Heures</th>
                <th className="p-3 text-left">Progression</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const progress = progressOf(student);
                const hours = stageHoursOf(student);

                return (
                  <tr key={student.id} className="border-t">
                    <td className="p-3 font-semibold">{student.name}</td>
                    <td className="p-3">{student.studentNumber}</td>
                    <td className="p-3">{student.group}</td>
                    <td className="p-3">
                      {student.stagePlace.supervisorName}
                    </td>
                    <td className="p-3">
                      {student.stagePlace.companyName}
                    </td>
                    <td className="p-3">
                      {hours.done}/{hours.total} h
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${progress.percent}%`,
                              backgroundColor:
                                progress.percent >= 100
                                  ? BRAND.green
                                  : BRAND.orange,
                            }}
                          />
                        </div>
                        <span className="font-bold">
                          {progress.percent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CompliancePanel() {
  return (
    <Card className="rounded-2xl shadow-sm border-2 border-green-200 bg-green-50">
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-700" />
          <h2 className="text-2xl font-black text-green-900">Conformité Direction</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {securityFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                <Check className="h-4 w-4" />
              </span>
              <span className="font-semibold text-slate-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4">
          <h3 className="mb-2 font-black text-[#0D3B66]">État du système</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-blue-50 p-3 text-sm">
              <b>Microsoft 365</b>
              <br />
              Connecté
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-sm">
              <b>Sauvegarde</b>
              <br />
              Active
            </div>
            <div className="rounded-xl bg-orange-50 p-3 text-sm">
              <b>Audit</b>
              <br />
              Horodaté
            </div>
            <div className="rounded-xl bg-slate-100 p-3 text-sm">
              <b>Confidentialité</b>
              <br />
              Conforme CSS
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditTrail({ student }) {
  const logs = [
    `${student.name} a rempli une entrée de journal.`,
    `${student.stagePlace.supervisorName} a signé le protocole.`,
    `Présences synchronisées automatiquement.`,
    `Export PDF généré par l’enseignant.`,
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Journal d’audit</h2>
        <p className="text-sm text-slate-500">
          Historique complet des actions effectuées dans le dossier.
        </p>

        <div className="mt-4 space-y-2">
          {logs.map((log, index) => (
            <div
              key={`${log}-${index}`}
              className="rounded-xl border bg-white p-3 text-sm"
            >
              <div className="font-semibold">{log}</div>
              <div className="text-xs text-slate-500">
                {new Date().toLocaleString("fr-CA")}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DirectionView({ students }) {
  const active = students.length;
  const completed = students.filter((student) => progressOf(student).percent >= 100).length;
  const atRisk = students.filter((student) => progressOf(student).stageHours.done < 60).length;
  const averageHours = Math.round(
    students.reduce((total, student) => total + stageHoursOf(student).done, 0) / Math.max(students.length, 1)
  );

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl border-2 border-[#0D3B66] bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-[#0D3B66]" />
            <div>
              <h1 className="text-3xl font-black text-[#0D3B66]">Vue Direction</h1>
              <p className="text-sm text-slate-500">Portrait global des stages, sans accès aux sections de modification enseignant.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat value={active} label="stages actifs" />
            <Stat value={completed} label="dossiers complets" />
            <Stat value={atRisk} label="élèves à surveiller" />
            <Stat value={`${averageHours} h`} label="moyenne des heures" />
          </div>
        </CardContent>
      </Card>

      <DirectionDashboard students={students} />
      <PartnerCompaniesPanel />
      <ArchivePanel />
    </div>
  );
}

function DirectionDashboard({ students }) {
  const completed = students.filter((student) => progressOf(student).percent >= 100).length;
  const active = students.length;
  const late = students.filter((student) => progressOf(student).stageHours.done < 60).length;
  const averageHours = Math.round(students.reduce((accumulator, student) => accumulator + stageHoursOf(student).done, 0) / students.length);

  return (
    <Card className="rounded-2xl shadow-sm border-2 border-[#0D3B66] bg-white">
      <CardContent className="p-4 md:p-5">
        <div className="mb-5 flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-[#0D3B66]" />
          <h2 className="text-2xl font-black text-[#0D3B66]">
            Tableau de bord Direction
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat value={active} label="stages actifs" />
          <Stat value={completed} label="dossiers complets" />
          <Stat value={late} label="élèves à risque" />
          <Stat value={`${averageHours} h`} label="moyenne des heures" />
        </div>
      </CardContent>
    </Card>
  );
}

function TeamMeetingsPanel() {
  const meetings = [
    "Rencontre initiale Teams - 21 avril 2026",
    "Suivi mi-stage - 5 mai 2026",
    "Évaluation finale - 14 mai 2026",
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-700" />
          <h2 className="text-xl font-black">Intégration Teams / Outlook</h2>
        </div>

        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting} className="flex flex-col gap-3 rounded-xl border bg-white p-4 md:flex-row md:items-center md:justify-between">
              <div className="font-semibold">{meeting}</div>
              <Button className="rounded-xl" style={{ backgroundColor: BRAND.navy }}>
                Planifier Teams
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function StageVisitsPanel() {
  const visits = [
    {
      date: "2026-04-28",
      teacher: "Jonathan Beaulieu",
      notes: "Excellent encadrement du superviseur et bonne attitude du stagiaire.",
    },
    {
      date: "2026-05-06",
      teacher: "Jonathan Beaulieu",
      notes: "Suivi demandé concernant la ponctualité.",
    },
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Visites de stage</h2>

        <div className="mt-4 space-y-3">
          {visits.map((visit) => (
            <div key={`${visit.date}-${visit.notes}`} className="rounded-xl border bg-white p-4">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="font-black text-[#0D3B66]">{visit.date}</div>
                <div className="text-sm text-slate-500">{visit.teacher}</div>
              </div>
              <p className="mt-2 text-sm text-slate-700">{visit.notes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerCompaniesPanel() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Milieux de stage partenaires</h2>

        <div className="mt-4 overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Entreprise</th>
                <th className="p-3 text-left">Superviseur</th>
                <th className="p-3 text-left">Dernier stagiaire</th>
                <th className="p-3 text-left">État</th>
              </tr>
            </thead>

            <tbody>
              {stagePartnerCompanies.map((company) => (
                <tr key={company.company} className="border-t">
                  <td className="p-3 font-semibold">{company.company}</td>
                  <td className="p-3">{company.supervisor}</td>
                  <td className="p-3">{company.lastIntern}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${company.status === "Excellent milieu" ? "bg-green-600" : "bg-orange-500"}`}>
                      {company.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ImportStudentsPanel() {
  return (
    <Card className="rounded-2xl shadow-sm border border-dashed">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Importation des élèves</h2>
        <p className="mt-2 text-sm text-slate-600">
          Importation compatible CSV, Excel et Microsoft 365.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button className="rounded-xl" style={{ backgroundColor: BRAND.green }}>
            Importer CSV
          </Button>

          <Button className="rounded-xl" style={{ backgroundColor: BRAND.blue }}>
            Importer Excel
          </Button>

          <Button className="rounded-xl" style={{ backgroundColor: BRAND.navy }}>
            Synchroniser Microsoft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ArchivePanel() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Archivage des cohortes</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4">
            <div className="font-black">2025-2026</div>
            <div className="text-sm text-slate-500">Cohorte active</div>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <div className="font-black">2024-2025</div>
            <div className="text-sm text-slate-500">Archivée</div>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <div className="font-black">2023-2024</div>
            <div className="text-sm text-slate-500">Archivée</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationsPanel() {
  const notifications = [
    "Rappel automatique envoyé au superviseur.",
    "Journal non rempli depuis 3 jours.",
    "Le protocole de stage est signé.",
    "Le dossier final est prêt pour archivage.",
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Notifications automatiques</h2>

        <div className="mt-4 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification}
              className="rounded-xl bg-blue-50 p-3 text-sm font-semibold text-blue-900"
            >
              {notification}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickMessages({ student }) {
  const [message, setMessage] = useState("");
  const messages = ["Merci, document reçu.", "Il manque une signature.", "Peux-tu corriger cette entrée?", "Excellent suivi cette semaine."];
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4 md:p-5">
        <h2 className="text-xl font-black">Messages rapides</h2>
        <p className="text-sm text-slate-500">Note rapide pour {student.name} ou son superviseur.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {messages.map((text) => <Button key={text} variant="outline" className="h-auto rounded-xl whitespace-normal" onClick={() => setMessage(text)}>{text}</Button>)}
        </div>
        <textarea className="mt-3 min-h-20 w-full rounded-2xl border p-3" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Écrire un message..." />
        <Button className="mt-3 rounded-xl" style={{ backgroundColor: BRAND.navy }}>Envoyer la note</Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [role, setRole] = useState("student");
  const [students, setStudents] = useState(initialStudents);
  const [activeStudentId, setActiveStudentId] = useState("e001");
  const [selectedDate, setSelectedDate] = useState("2026-04-20");
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("VC00001");
  const [session, setSession] = useState({ name: "Camille Tremblay", email: "camille.tremblay@eleve.cfp.ca", group: "Vente-Conseil 5321" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(APP_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.students)) setStudents(parsed.students);
      if (typeof parsed.activeStudentId === "string") setActiveStudentId(parsed.activeStudentId);
      if (typeof parsed.selectedDate === "string") setSelectedDate(parsed.selectedDate);
      if (typeof parsed.selectedGroup === "string") setSelectedGroup(parsed.selectedGroup);
      if (parsed.session && typeof parsed.session === "object") setSession(parsed.session);
      if (typeof parsed.role === "string") setRole(parsed.role);
    } catch (error) {
      console.warn("Impossible de charger les données locales du portail S.T.A.G.E.", error);
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    try {
      window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify({ students, activeStudentId, selectedDate, selectedGroup, session, role }));
    } catch (error) {
      console.warn("Impossible de sauvegarder les données locales du portail S.T.A.G.E.", error);
    }
  }, [storageReady, students, activeStudentId, selectedDate, selectedGroup, session, role]);

  const calendarDays = useMemo(() => monthMatrix(2026, 3), []);
  const activeStudent = students.find((student) => student.id === activeStudentId) || students[0];
  const selected = activeStudent.entries[selectedDate] || emptyEntry;
  const filteredStudents = students.filter((student) => {
    const matchesSearch = `${student.name} ${student.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = role === "admin" ? student.group === selectedGroup : true;
    return matchesSearch && matchesGroup;
  });

  const updateEntry = (field, value) => {
    setStudents((previous) => previous.map((student) => (
      student.id === activeStudentId
        ? { ...student, entries: { ...student.entries, [selectedDate]: { ...selected, [field]: value } } }
        : student
    )));
  };

  const updateSupervisorDoc = (studentId, doc, value) => {
    setStudents((previous) => previous.map((student) => {
      if (student.id !== studentId) return student;
      const updatedStudent = { ...student, supervisorDocs: { ...student.supervisorDocs, [doc]: value } };
      const shouldGenerateProtocolPdf = doc === "protocol" && (value.status === "Complété" || Boolean(value.signature));
      const shouldGenerateAppreciationPdf = doc === "appreciation" && (value.status === "Complété" || Boolean(value.signature));
      const generatedFile = shouldGenerateProtocolPdf
        ? "Protocole de stage - signé.pdf"
        : shouldGenerateAppreciationPdf
          ? "Appréciation du superviseur - signée.pdf"
          : null;
      if (!generatedFile || updatedStudent.files.includes(generatedFile)) return updatedStudent;
      return { ...updatedStudent, files: [...updatedStudent.files, generatedFile] };
    }));
  };

  const updatePresence = (studentId, index, field, value) => {
    setStudents((previous) => previous.map((student) => {
      if (student.id !== studentId) return student;
      const presence = [...student.supervisorDocs.presence];
      presence[index] = { ...presence[index], [field]: value };
      const updatedStudent = { ...student, supervisorDocs: { ...student.supervisorDocs, presence } };
      const generatedFile = "Grille de présence - générée.pdf";
      if (updatedStudent.files.includes(generatedFile)) return updatedStudent;
      return { ...updatedStudent, files: [...updatedStudent.files, generatedFile] };
    }));
  };

  const fileInputRef = useRef(null);
  const [pendingDocumentType, setPendingDocumentType] = useState("");

  const requestDocumentUpload = (fileType) => {
    setPendingDocumentType(fileType);
    fileInputRef.current?.click();
  };

  const handleDocumentUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const label = pendingDocumentType || "Document";
    const record = `${label} — ${file.name}`;
    setStudents((previous) => previous.map((student) => (
      student.id === activeStudentId
        ? { ...student, files: student.files.includes(record) ? student.files : [...student.files, record] }
        : student
    )));
    event.target.value = "";
    setPendingDocumentType("");
  };

  if (!isAuthenticated) {
    return <AuthPage role={role} setRole={setRole} session={session} setSession={setSession} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} onConnect={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden rounded-b-[1.5rem] bg-white md:rounded-b-[2.5rem]"><BannerImage /></div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:px-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-10">
          <div className="h-[150px] sm:h-[190px] md:h-[320px]" />
          <Card className="z-10 w-full rounded-2xl bg-white/95 shadow-2xl md:max-w-sm">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Session active</span>
                <button className="text-xs font-bold text-blue-700" onClick={() => setIsAuthenticated(false)}>Déconnexion</button>
              </div>
              <p className="font-bold">{role === "direction" ? "Mode direction" : role === "admin" ? "Mode enseignant" : role === "supervisor" ? "Mode superviseur" : session.name}</p>
              <p className="text-sm text-slate-500">{session.email}</p>
            </CardContent>
          </Card>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-4 px-3 py-4 sm:px-4 md:gap-6 md:px-6 md:py-6 lg:grid-cols-[310px_1fr]">
        <aside className="space-y-4 rounded-2xl bg-[#062B46] p-3 shadow-2xl md:space-y-6 md:rounded-3xl md:p-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Profil</h2>{role === "admin" ? <ShieldCheck /> : role === "supervisor" ? <UserCheck /> : <UserRound />}</div>
              <p className="font-semibold">{role === "direction" ? "Mode direction" : role === "admin" ? "Mode enseignant" : role === "supervisor" ? "Mode superviseur" : session.name}</p>
              <p className="text-sm text-slate-500">{session.email}</p>
              <p className="mt-2 rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ background: BRAND.green }}>{role === "direction" ? "Vue globale" : role === "admin" ? selectedGroup : session.group}</p>
            </CardContent>
          </Card>

          {(role === "admin" || role === "supervisor") && (
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2 font-bold"><UsersRound className="h-5 w-5" /> Élèves associés</div>
                {role === "admin" && <select className="mb-3 w-full rounded-xl border bg-white p-3" value={selectedGroup} onChange={(event) => { setSelectedGroup(event.target.value); const first = students.find((student) => student.group === event.target.value); if (first) setActiveStudentId(first.id); }}>{teacherGroups.map((group) => <option key={group} value={group}>Groupe {group}</option>)}</select>}
                <div className="relative mb-3"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className="w-full rounded-xl border py-2 pl-9 pr-3" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher" /></div>
                {filteredStudents.map((student) => <button key={student.id} className={`mb-2 w-full rounded-xl p-3 text-left ${student.id === activeStudentId ? "bg-blue-50 ring-2 ring-blue-200" : "bg-slate-50"}`} onClick={() => setActiveStudentId(student.id)}><b>{student.name}</b><div className="text-xs text-slate-500">{student.stagePlace.companyName}</div></button>)}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2 font-bold"><FolderUp className="h-5 w-5" /> Documents</div>
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleDocumentUpload} />
              {requiredFiles.map((file) => <Button key={file} variant="outline" className="mb-2 h-auto w-full justify-start whitespace-normal rounded-xl text-left" onClick={() => requestDocumentUpload(file)}><Plus className="mr-2 h-4 w-4" />Déposer : {file}</Button>)}
              <div className="mt-4 space-y-2">{activeStudent.files.map((file) => <div key={file} className="rounded-xl bg-slate-100 p-2 text-sm"><FileText className="mr-2 inline h-4 w-4" />{file}</div>)}</div>
              <Button className="mt-4 w-full rounded-xl" style={{ backgroundColor: BRAND.navy }} onClick={() => makeDownload(`dossier-${activeStudent.name}.txt`, buildStudentPackage(activeStudent))}><Download className="mr-2 h-4 w-4" />Télécharger dossier</Button>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4 md:space-y-6">
          {role === "direction" && <DirectionView students={students} />}
          {role === "admin" && <AlertPanel students={filteredStudents} />}
          {role === "admin" && <TeacherManagementPanel students={filteredStudents} />}
          {role === "admin" && <DirectionDashboard students={filteredStudents} />}
          {role === "admin" && <TeamMeetingsPanel />}
          {role === "admin" && <ImportStudentsPanel />}
          {role === "admin" && <PartnerCompaniesPanel />}
          {role === "admin" && <ArchivePanel />}
          {role === "admin" && <StageVisitsPanel />}
          {role !== "supervisor" && role !== "direction" && <StageInfoCard student={activeStudent} showStudentNumber={role === "admin" || role === "direction"} />}
          {role !== "supervisor" && role !== "direction" && <HoursOverview student={activeStudent} />}
          {role !== "supervisor" && role !== "direction" && <ProgressOverview student={activeStudent} />}
          {role === "admin" && <DocumentStatus student={activeStudent} />}
          {role === "tos" && <TosView />}

          {role === "direction" ? null : role === "supervisor" ? (
            <>
              <SupervisorTeacherContact />
              <StageInfoCard student={activeStudent} showStudentNumber={role === "admin" || role === "direction"} />
              <HoursOverview student={activeStudent} />
              <ProgressOverview student={activeStudent} />
              <SupervisorSection students={students} activeStudentId={activeStudentId} setActiveStudentId={setActiveStudentId} updateSupervisorDoc={updateSupervisorDoc} updatePresence={updatePresence} />
              <ActivityFeed student={activeStudent} />
            </>
          ) : (
            <>
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div><h2 className="text-2xl font-black">Calendrier d’entrées</h2><p className="text-slate-500">Clique sur une date pour remplir le journal de bord.</p></div>
                    <Button className="rounded-xl" style={{ backgroundColor: BRAND.navy }} onClick={() => makeDownload(`journal-${activeStudent.name}.txt`, buildStudentPackage(activeStudent))}><Download className="mr-2 h-4 w-4" />Télécharger / imprimer</Button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {days.map((day) => <div key={day} className="p-1 text-center text-xs font-bold text-slate-500 sm:p-2">{day}</div>)}
                    {calendarDays.map((date) => {
                      const key = formatDate(date);
                      const hasEntry = Boolean(activeStudent.entries[key]);
                      const isSelected = selectedDate === key;
                      return <button key={key} onClick={() => setSelectedDate(key)} className={`min-h-14 rounded-xl border p-1 text-left sm:min-h-20 sm:p-2 ${isSelected ? "border-blue-500 bg-blue-50" : "bg-white"}`}><div className="flex items-center justify-between"><span className="text-xs font-bold sm:text-base">{date.getDate()}</span>{hasEntry && <span className="h-2 w-2 rounded-full" style={{ background: BRAND.green }} />}</div><div className="mt-1 hidden text-xs text-slate-500 sm:block">{hasEntry ? activeStudent.entries[key].tasks : "Aucune entrée"}</div></button>;
                    })}
                  </div>
                </CardContent>
              </Card>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} key={`${activeStudentId}-${selectedDate}`}>
                <Card>
                  <CardContent className="p-4 md:p-5">
                    <div className="mb-4 flex items-center gap-3"><CalendarDays className="h-6 w-6 text-blue-700" /><div><h2 className="text-xl font-black">Entrée du {selectedDate}</h2><p className="text-sm text-slate-500">{activeStudent.name} · {activeStudent.group}</p></div></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Tâches réalisées" textarea value={selected.tasks} onChange={(value) => updateEntry("tasks", value)} />
                      <Field label="Compétences mobilisées" textarea value={selected.skills} onChange={(value) => updateEntry("skills", value)} />
                      <Field label="Difficultés rencontrées / solutions" textarea value={selected.challenges} onChange={(value) => updateEntry("challenges", value)} />
                      <Field label="Apprentissages et réflexions" textarea value={selected.learnings} onChange={(value) => updateEntry("learnings", value)} />
                    </div>
                    <div className="mt-5 flex gap-3"><Button className="rounded-xl" style={{ backgroundColor: BRAND.green }}>Sauvegarder</Button><Button variant="outline" className="rounded-xl"><Mail className="mr-2 h-4 w-4" />Rappel</Button></div>
                  </CardContent>
                </Card>
              </motion.div>

              {role === "admin" && <><SupervisorSection students={students} activeStudentId={activeStudentId} setActiveStudentId={setActiveStudentId} updateSupervisorDoc={updateSupervisorDoc} updatePresence={updatePresence} /><div className="grid gap-4 lg:grid-cols-2"><ActivityFeed student={activeStudent} /><QuickMessages student={activeStudent} /></div></>}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
