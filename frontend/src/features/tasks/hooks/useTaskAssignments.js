import { useState, useEffect, useCallback } from "react";
import { getAssignments } from "../services/taskService";

// Hook genérico para cargar asignaciones.
// filters: { user?, group?, task?, state?, scope? }
export default function useTaskAssignments(filters = {}) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Solo se usa como dependencia a nivel de valores, no el objeto entero.
    const user  = filters.user;
    const group = filters.group;
    const task  = filters.task;
    const state = filters.state;
    const scope = filters.scope;
    const notification = filters.notification;
    const enabled = filters.enabled !== false;

    const reload = useCallback(async () => {
        if (!enabled) {
            setAssignments([]);
            setError(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getAssignments({ user, group, task, state, scope, notification });
            setAssignments(data);
            setError(null);
        } catch (err) {
            setError(err);
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    }, [user, group, task, state, scope, notification, enabled]);

    useEffect(() => {
        reload();
    }, [reload]);

    return { assignments, setAssignments, loading, error, reload };
}
