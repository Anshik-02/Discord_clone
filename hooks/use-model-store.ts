import {create} from "zustand"

export type ModalType="createServer"|"invite"|"editServer"|"members"|"createChannel"|"leaveServer"|"deleteServer"|"deleteChannel"|"editChannel"|"messageFile"|"deleteMessage"


interface ModalStore{
    type:ModalType|null,
    isOpen:Boolean,
    data?:any
    onOpen:(type:ModalType,data:any)=>void,
    onClose:()=>void
}


export const useModel=create<ModalStore>((set)=>({
   type:null,
   data:{},
   isOpen:false,
   onOpen: (type, data = {}) => {

    set({ isOpen: true, type, data });
  },
  onClose: () => {
  
    set({ isOpen: false, type: null });
  },
}))
