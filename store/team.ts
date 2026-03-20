import { useCallback, useEffect, useMemo, useState } from "react";
import type { PokemonCardData, Team } from "@/types/pokemon";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { readJSON, writeJSON } from "../utils/storage";

type TeamState = {
  team: Team;
  loading: boolean;
  setTeamName: (name: string) => Promise<void>;
  addMember: (p: PokemonCardData) => Promise<{ ok: boolean; reason?: string }>;
  removeMember: (name: string) => Promise<void>;
  clearTeam: () => Promise<void>;
  reload: () => Promise<void>;
};

const EMPTY_TEAM: Team = { name: "My Team", members: [] };

export function useTeam(): TeamState {
  const [team, setTeam] = useState<Team>(EMPTY_TEAM);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await readJSON<Team>(STORAGE_KEYS.team, EMPTY_TEAM);
    setTeam(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const persist = useCallback((next: Team) => {
    setTeam(next);
    void writeJSON(STORAGE_KEYS.team, next);
  }, []);

  const setTeamName = useCallback(
    async (name: string) => {
      persist({ ...team, name });
    },
    [persist, team],
  );

  const addMember = useCallback(
    async (p: PokemonCardData) => {
      if (team.members.some((m) => m.name === p.name)) {
        return { ok: false, reason: "Цей покемон вже в команді." };
      }
      if (team.members.length >= 6) {
        return { ok: false, reason: "У команді максимум 6 покемонів." };
      }
      persist({ ...team, members: [...team.members, p] });
      return { ok: true };
    },
    [persist, team],
  );

  const removeMember = useCallback(
    async (name: string) => {
      persist({
        ...team,
        members: team.members.filter((m) => m.name !== name),
      });
    },
    [persist, team],
  );

  const clearTeam = useCallback(async () => {
    persist({ ...team, members: [] });
  }, [persist, team]);

  return useMemo(
    () => ({
      team,
      loading,
      setTeamName,
      addMember,
      removeMember,
      clearTeam,
      reload,
    }),
    [team, loading, setTeamName, addMember, removeMember, clearTeam, reload],
  );
}
