import { apiFetch } from "@/services/http";

// --- Interfaces ---
export interface OrgCourse {
    id: number;
    uid: string;
    org_company_id: number;
    title: string;
    slug: string;
    description: string | null;
    cover_image_url: string | null;
    preview_video_url: string | null;
     cover_url: string | null;
      preview_url: string | null;
    is_free: boolean;
    is_active: boolean;
    revenuecat_entitlement_id: string | null;
    price: number | null;
    status: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

export interface CreateCourseDto {
    title: string;
    slug: string;
    description?: string;
    cover_image_url?: string;
    preview_video_url?: string;
    is_free?: boolean;
    is_active?: boolean;
    price?: number | null;
    revenuecat_entitlement_id?: string | null;
    status?: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
    cover_image_url?: string;
    preview_video_url?: string;
    price?: number | null;
    revenuecat_entitlement_id?: string | null;
    is_active?: boolean;
    metadata?: Record<string, any>;
}

export interface PaginatedMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    kpis?: {
        total_published: number;
        total_drafts: number;
        new_this_month: number;
    };
}

export interface PaginatedCourses {
    data: OrgCourse[];
    meta: PaginatedMeta;
}

// --- Servicio ---
export const OrgCourseService = {
    getAll: async (workspaceUid: string, page: number = 1, perPage: number = 100, search: string = ""): Promise<PaginatedCourses> => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("per_page", perPage.toString());
        if (search) params.append("search", search);

        return await apiFetch(`/org-companies/${workspaceUid}/courses?${params.toString()}`);
    },

    getOne: async (workspaceUid: string, courseUid: string): Promise<OrgCourse> => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}`);
        return response.data;
    },

    create: async (workspaceUid: string, data: CreateCourseDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    update: async (workspaceUid: string, courseUid: string, data: UpdateCourseDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async (workspaceUid: string, courseUid: string) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}`, {
            method: "DELETE",
        });
    },
};



// --- Interfaces para Módulos y Lecciones ---
export interface OrgCourseLesson {
    id: number;
    uid: string;
    org_course_module_id: number;
    title: string;
    description: string | null;
    video_path: string | null;
    duration_seconds: number;
    is_free_preview: boolean;
    sort_order: number;
    is_active: boolean;
}

export interface OrgCourseModule {
    id: number;
    uid: string;
    org_course_id: number;
    title: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
    lessons: OrgCourseLesson[]; // Relación anidada que nos devuelve el backend
}

export interface CreateModuleDto {
    title: string;
    description?: string;
    is_active?: boolean;
}

export interface CreateLessonDto {
    title: string;
    description?: string;
    video_path?: string;
    duration_seconds?: number;
    is_free_preview?: boolean;
    is_active?: boolean;
}

// --- Servicio de Contenido del Curso ---
export const OrgCourseContentService = {
    // Obtener el árbol completo
    getContent: async (workspaceUid: string, courseUid: string): Promise<OrgCourseModule[]> => {
        const response = await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/content`);
        return response.data;
    },

    // Crear Módulo
    createModule: async (workspaceUid: string, courseUid: string, data: CreateModuleDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Editar Módulo
    updateModule: async (workspaceUid: string, courseUid: string, moduleUid: string, data: CreateModuleDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/${moduleUid}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    // Eliminar Módulo
    deleteModule: async (workspaceUid: string, courseUid: string, moduleUid: string) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/${moduleUid}`, {
            method: "DELETE",
        });
    },


    // Pre-firma para Video Privado (Lecciones)
    presignLessonVideo: async (workspaceUid: string, courseUid: string, fileName: string, mimeType: string) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/lessons/presign`, {
            method: "POST",
            body: JSON.stringify({ file_name: fileName, mime_type: mimeType }),
        });
    },

    // Crear Lección
    createLesson: async (workspaceUid: string, courseUid: string, moduleUid: string, data: CreateLessonDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/${moduleUid}/lessons`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    // Editar Lección
    updateLesson: async (workspaceUid: string, courseUid: string, moduleUid: string, lessonUid: string, data: CreateLessonDto) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/${moduleUid}/lessons/${lessonUid}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    // Eliminar Lección
    deleteLesson: async (workspaceUid: string, courseUid: string, moduleUid: string, lessonUid: string) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/${moduleUid}/lessons/${lessonUid}`, {
            method: "DELETE",
        });
    },

    reorderModules: async (workspaceUid: string, courseUid: string, modules: { uid: string; sort_order: number }[]) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/reorder`, {
            method: "PUT",
            body: JSON.stringify({ modules }),
        });
    },

reorderLessons: async (workspaceUid: string, courseUid: string, moduleUid: string, lessons: { uid: string; sort_order: number }[]) => {
        return await apiFetch(`/org-companies/${workspaceUid}/courses/${courseUid}/modules/${moduleUid}/lessons/reorder`, {
            method: "PUT",
            body: JSON.stringify({ lessons }),
        });
    },



};