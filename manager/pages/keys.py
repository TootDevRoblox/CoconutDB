import customtkinter as ctk

import api


class KeysPage(ctk.CTkFrame):

    def __init__(self, master):
        super().__init__(master)

        title = ctk.CTkLabel(
            self,
            text="API Keys",
            font=("Segoe UI", 28, "bold")
        )

        title.pack(
            anchor="w",
            padx=25,
            pady=(20, 10)
        )

        top = ctk.CTkFrame(self)

        top.pack(
            fill="x",
            padx=25
        )

        self.entry = ctk.CTkEntry(
            top,
            placeholder_text="Nome da Key"
        )

        self.entry.pack(
            side="left",
            fill="x",
            expand=True,
            padx=(0, 10)
        )

        ctk.CTkButton(
            top,
            text="Criar",
            command=self.create
        ).pack(side="left")

        self.list = ctk.CTkScrollableFrame(self)

        self.list.pack(
            fill="both",
            expand=True,
            padx=25,
            pady=20
        )

        self.refresh()

    def refresh(self):

        for w in self.list.winfo_children():
            w.destroy()

        keys = api.get_keys()

        for key in keys:

            frame = ctk.CTkFrame(self.list)

            frame.pack(
                fill="x",
                pady=5
            )

            ctk.CTkLabel(
                frame,
                text=key["name"]
            ).pack(
                side="left",
                padx=15
            )

            ctk.CTkLabel(
                frame,
                text=key["key"]
            ).pack(
                side="left",
                padx=20
            )

            ctk.CTkButton(
                frame,
                text="Excluir",
                width=90,
                command=lambda i=key["id"]: self.delete(i)
            ).pack(
                side="right",
                padx=10,
                pady=8
            )

    def create(self):

        name = self.entry.get()

        if not name:
            return

        api.create_key(name)

        self.entry.delete(0, "end")

        self.refresh()

    def delete(self, id):

        api.delete_key(id)

        self.refresh()