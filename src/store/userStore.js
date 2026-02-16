import { supabase } from "@/lib/supabase";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    // 箱を作る
    (set) => ({
      userId: null,
      userName: '',
      isGuest: false,
      registeredUsers:[],

    // 変更関数を作成する1
      setUser: (id,name) => set({
        userId: id,
        userName: name,
        isGuest: false
      }),

      // 変更関数を作成する2
      setGuestUser: async() => {
        const guestId = -Math.floor(Math.random() * 1000000);
        const { error } = await supabase
        .from('users')
        .insert({
          user_id: guestId,
          name: "ゲスト"
        });

        if(error){
          console.error('ゲストユーザー登録エラー',error);
          return;
        }

        set({
          userId: guestId,
          userName:'ゲスト',
          isGuest: true
        });
      },

      // 変更関数を作成する3
      logout: () => set({
        userId: null,
        userName: '',
        isGuest: false
      }),

      //ユーザーをローカルに登録する関数
      addRegisteredUser: (id, name) => set((state)=>({
        registeredUsers:[
          ...state.registeredUsers, //既存ユーザーリスト
          {userId: id, userName: name} //新規ユーザー
        ]
      })),
      //登録リストから削除する関数
      removeRegisteredUser: (id) => set((state)=>({
        registeredUsers: state.registeredUsers.filter(
          user => user.userId !== id
        )
      }))
    }),
    {
      name: 'user-storage' //ローカルストレージのキー名
    }
  )
);

export default useUserStore;
