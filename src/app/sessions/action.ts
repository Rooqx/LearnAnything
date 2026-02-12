//Start all chat sessions to load on the side menu

export const getAllSessions = async () => {
  const sessions = await getAllSessionsForUser();
  if (!sessions) {
    return { success: false, error: "Failed to fetch sessions" };
  }

  return { success: true, data: sessions };
};

//Start a chat session

export const getSession = async (sessionId: string) => {
  const session = await getSessionById(sessionId);
  if (!session) {
    return { success: false, error: "Failed to fetch session" };
  }

  return { success: true, data: session };
};

//Start new chat session

export const createSession = async (title: string, description: string) => {
  const session = await createSessionForUser(title, description);
  if (!session) {
    return { success: false, error: "Failed to create session" };
  }

  return { success: true, data: session };
};
