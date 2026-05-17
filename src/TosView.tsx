import React, { useMemo, useState } from "react";
import { Download, FileUp, Plus, Search, Trash2, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProtocolStatus = "Signé" | "À compléter" | "Brouillon";

type TosStudent = {
  id: string;
  name: string;
  studentNumber: string;
  email: string;
  program: string;
  group: string;
  stagePlace: string;
  supervisor: string;
  protocol: ProtocolStatus;
};

const PROGRAMS = [
  "Vente-Conseil 5321",
  "Secrétariat 5357",
  "Comptabilité 5231",
  "Lancement d’entreprise 5361",
  "Entretien mécanique 5346",
];

const INITIAL_STUDENTS: TosStudent[] = [
  {
    id: "1",
    name: "Camille Tremblay",
    studentNumber: "170987",
    email: "camille.tremblay@eleve.cfp.ca",
    program: "Vente-Conseil 5321",
    group: "VC00001",
    stagePlace: "Sports Experts Chicoutimi",
    supervisor: "Marc Bouchard",
    protocol: "Signé",
  },
  {
    id: "2",
    name: "Noah Gagnon",
    studentNumber: "170988",
    email: "noah.gagnon@eleve.cfp.ca",
    program: "Vente-Conseil 5321",
    group: "VC00002",
    stagePlace: "Boutique Le Coureur",
    supervisor: "Sophie Tremblay",
    protocol: "À compléter",
  },
];

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function buildProtocol(student: TosStudent) {
  return [
    `PROTOCOLE DE STAGE`,
    ``,
    `Élève : ${student.name}`,
    `Numéro de fiche : ${student.studentNumber}`,
    `Courriel : ${student.email}`,
    `Programme : ${student.program}`,
    `Groupe : ${student.group}`,
    ``,
    `Milieu de stage : ${student.stagePlace}`,
    `Superviseur : ${student.supervisor}`,
    `Statut du protocole : ${student.protocol}`,
  ].join("\n");
}

function parseCsv(text: string): TosStudent[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const rows = lines.slice(1);

  return rows.map((line, index) => {
    const separator = line.includes(";") ? ";" : ",";
    const values = line.split(separator).map((value) => value.trim());

    return {
      id: crypto.randomUUID(),
      name: values[0] || `Élève importé ${index + 1}`,
      studentNumber: values[1] || "",
      email: values[2] || "",
      program: values[3] || "Vente-Conseil 5321",
      group: values[4] || "Nouveau groupe",
      stagePlace: values[5] || "",
      supervisor: values[6] || "",
      protocol: (values[7] as ProtocolStatus) || "À compléter",
    };
  });
}

export default function TosView() {
  const [students, setStudents] = useState<TosStudent[]>(INITIAL_STUDENTS);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TosStudent | null>(null);
  const [newGroup, setNewGroup] = useState("");

  const groups = useMemo(() => {
    return Array.from(new Set(students.map((student) => student.group))).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    const lower = query.toLowerCase();
    return students.filter((student) =>
      `${student.name} ${student.studentNumber} ${student.email} ${student.program} ${student.group} ${student.stagePlace}`
        .toLowerCase()
        .includes(lower)
    );
  }, [students, query]);

  const stats = useMemo(() => {
    const signed = students.filter((student) => student.protocol === "Signé").length;
    const missing = students.filter((student) => student.protocol !== "Signé").length;

    return {
      total: students.length,
      groups: groups.length,
      signed,
      missing,
    };
  }, [students, groups]);

  function addStudent() {
    const student: TosStudent = {
      id: crypto.randomUUID(),
      name: "Nouvel élève",
      studentNumber: "",
      email: "",
      program: "Vente-Conseil 5321",
      group: groups[0] || "Nouveau groupe",
      stagePlace: "",
      supervisor: "",
      protocol: "À compléter",
    };

    setStudents((current) => [...current, student]);
    setEditingId(student.id);
    setDraft(student);
  }

  function startEdit(student: TosStudent) {
    setEditingId(student.id);
    setDraft({ ...student });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(null);
  }

  function saveEdit() {
    if (!draft) return;

    setStudents((current) =>
      current.map((student) => (student.id === draft.id ? draft : student))
    );

    setEditingId(null);
    setDraft(null);
  }

  function deleteStudent(id: string) {
    setStudents((current) => current.filter((student) => student.id !== id));
  }

  function addGroup() {
    if (!newGroup.trim()) return;

    const student: TosStudent = {
      id: crypto.randomUUID(),
      name: "Élève à assigner",
      studentNumber: "",
      email: "",
      program: "Vente-Conseil 5321",
      group: newGroup.trim(),
      stagePlace: "",
      supervisor: "",
      protocol: "Brouillon",
    };

    setStudents((current) => [...current, student]);
    setNewGroup("");
  }

  async function handleCsvImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const importedStudents = parseCsv(text);

    setStudents((current) => [...current, ...importedStudents]);
    event.target.value = "";
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-2 border-purple-200 bg-purple-50 shadow-sm">
        <CardContent className="p-5">
          <h1 className="text-3xl font-black text-[#0D3B66]">
            Vue TOS
          </h1>
          <p className="text-sm text-slate-600">
            Gestion des élèves, groupes, protocoles et importation CSV.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <Stat value={stats.total} label="élèves" />
            <Stat value={stats.groups} label="groupes" />
            <Stat value={stats.signed} label="protocoles signés" />
            <Stat value={stats.missing} label="à compléter" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <h2 className="text-2xl font-black text-[#0D3B66]">
            Outils TOS
          </h2>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <Button
              className="rounded-xl"
              style={{ backgroundColor: "#0D3B66" }}
              onClick={addStudent}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un élève
            </Button>

            <label className="flex cursor-pointer items-center justify-center rounded-xl bg-orange-500 px-4 py-2 font-bold text-white">
              <FileUp className="mr-2 h-4 w-4" />
              Importer CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvImport}
              />
            </label>

            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                downloadTextFile(
                  "modele-import-tos.csv",
                  "name;studentNumber;email;program;group;stagePlace;supervisor;protocol\nCamille Tremblay;170987;camille@ecole.ca;Vente-Conseil 5321;VC00001;Sports Experts;Marc Bouchard;Signé"
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Modèle CSV
            </Button>

            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                downloadTextFile(
                  "protocoles-tos.txt",
                  students.map(buildProtocol).join("\n\n-----------------\n\n")
                )
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Tous les protocoles
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <h2 className="text-2xl font-black text-[#0D3B66]">
            Gestion des groupes
          </h2>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              className="w-full rounded-xl border p-3"
              placeholder="Ex. VC00003"
              value={newGroup}
              onChange={(event) => setNewGroup(event.target.value)}
            />

            <Button
              className="rounded-xl"
              style={{ backgroundColor: "#5AA85A" }}
              onClick={addGroup}
            >
              Créer le groupe
            </Button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {groups.map((group) => (
              <div key={group} className="rounded-2xl border bg-white p-4">
                <p className="text-xl font-black text-[#0D3B66]">
                  {group}
                </p>
                <p className="text-sm text-slate-500">
                  {students.filter((student) => student.group === group).length} élève(s)
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-[#0D3B66]">
              Gestion des élèves
            </h2>

            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                className="w-full rounded-xl border py-3 pl-10 pr-3"
                placeholder="Rechercher un élève, groupe, programme..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border bg-white">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-3 text-left">Élève</th>
                  <th className="p-3 text-left">No fiche</th>
                  <th className="p-3 text-left">Courriel</th>
                  <th className="p-3 text-left">Programme</th>
                  <th className="p-3 text-left">Groupe</th>
                  <th className="p-3 text-left">Milieu</th>
                  <th className="p-3 text-left">Superviseur</th>
                  <th className="p-3 text-left">Protocole</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => {
                  const isEditing = editingId === student.id;
                  const current = isEditing && draft ? draft : student;

                  return (
                    <tr key={student.id} className="border-t align-top">
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full rounded-lg border p-2"
                            value={current.name}
                            onChange={(event) =>
                              setDraft({ ...current, name: event.target.value })
                            }
                          />
                        ) : (
                          <strong>{student.name}</strong>
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full rounded-lg border p-2"
                            value={current.studentNumber}
                            onChange={(event) =>
                              setDraft({ ...current, studentNumber: event.target.value })
                            }
                          />
                        ) : (
                          student.studentNumber
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full rounded-lg border p-2"
                            value={current.email}
                            onChange={(event) =>
                              setDraft({ ...current, email: event.target.value })
                            }
                          />
                        ) : (
                          student.email
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <select
                            className="w-full rounded-lg border p-2"
                            value={current.program}
                            onChange={(event) =>
                              setDraft({ ...current, program: event.target.value })
                            }
                          >
                            {PROGRAMS.map((program) => (
                              <option key={program}>{program}</option>
                            ))}
                          </select>
                        ) : (
                          student.program
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full rounded-lg border p-2"
                            value={current.group}
                            onChange={(event) =>
                              setDraft({ ...current, group: event.target.value })
                            }
                          />
                        ) : (
                          student.group
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full rounded-lg border p-2"
                            value={current.stagePlace}
                            onChange={(event) =>
                              setDraft({ ...current, stagePlace: event.target.value })
                            }
                          />
                        ) : (
                          student.stagePlace
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full rounded-lg border p-2"
                            value={current.supervisor}
                            onChange={(event) =>
                              setDraft({ ...current, supervisor: event.target.value })
                            }
                          />
                        ) : (
                          student.supervisor
                        )}
                      </td>

                      <td className="p-3">
                        {isEditing ? (
                          <select
                            className="w-full rounded-lg border p-2"
                            value={current.protocol}
                            onChange={(event) =>
                              setDraft({
                                ...current,
                                protocol: event.target.value as ProtocolStatus,
                              })
                            }
                          >
                            <option>Signé</option>
                            <option>À compléter</option>
                            <option>Brouillon</option>
                          </select>
                        ) : (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                              student.protocol === "Signé"
                                ? "bg-green-600"
                                : student.protocol === "Brouillon"
                                ? "bg-slate-500"
                                : "bg-orange-500"
                            }`}
                          >
                            {student.protocol}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          {isEditing ? (
                            <>
                              <Button size="sm" onClick={saveEdit}>
                                <Save className="mr-1 h-4 w-4" />
                                Sauver
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                <X className="mr-1 h-4 w-4" />
                                Annuler
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => startEdit(student)}>
                                <Pencil className="mr-1 h-4 w-4" />
                                Modifier
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  downloadTextFile(
                                    `protocole-${student.name}.txt`,
                                    buildProtocol(student)
                                  )
                                }
                              >
                                <Download className="mr-1 h-4 w-4" />
                                Protocole
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteStudent(student.id)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Supprimer
                              </Button>
                            </>
                          )}
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
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-3xl font-black text-[#0D3B66]">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
