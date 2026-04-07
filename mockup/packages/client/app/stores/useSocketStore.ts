import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

interface SocketStore {
  socket: Socket | null;
  status: string;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  status: 'bağlanıyor',

  connect: () => {
    const existing = get().socket;
    if (existing) return;

    const socket = io(API_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      set({ status: 'bağlı' });
      socket.emit('ping');
    });
    socket.on('status', (message) => set({ status: message.message }));
    socket.on('pong', () => set({ status: 'ping/pong hazır' }));
    socket.on('disconnect', () => set({ status: 'bağlantı koptu' }));

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, status: 'bağlantı koptu' });
    }
  },
}));
