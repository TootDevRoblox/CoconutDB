import customtkinter as ctk
from ui.loader import Loader
import time
import api

from pages.datastore_view import DatastoreView


class KeysPage(ctk.CTkFrame):

    def __init__(self, master):
        super().__init__(master)

        # =========================
        # TITLE
        # =========================
        title = ctk.CTkLabel(
            self,
            text="API Keys",
            font=("Segoe UI", 28, "bold")
        )
        title.pack(anchor="w", padx=25, pady=(20, 10))

        # =========================
        # TOP BAR
        # =========================
        top = ctk.CTkFrame(self)
        top.pack(fill="x", padx=25)

        self.entry = ctk.CTkEntry(top, placeholder_text="Nome da Key")
        self.entry.pack(side="left", fill="x", expand=True, padx=(0, 10))

        ctk.CTkButton(
            top,
            text="Criar",
            command=self.create
        ).pack(side="left")

        # =========================
        # LIST
        # =========================
        self.list = ctk.CTkScrollableFrame(self)
        self.list.pack(fill="both", expand=True, padx=25, pady=20)

        self.refresh()

    # =========================
    # COPY KEY
    # =========================
    def copy_key(self, value):
        self.clipboard_clear()
        self.clipboard_append(value)
        self.update()
        print("📋 Copied:", value)

    # =========================
    # OPEN DATASTORE
    # =========================
    def open_datastore(self, datastore_id):

        print("OPEN:", datastore_id)

        self.destroy()

        view = DatastoreView(self.master, datastore_id)
        view.pack(fill="both", expand=True)

    # =========================
    # REFRESH KEYS
    # =========================
    def refresh(self):

        for w in self.list.winfo_children():
            w.destroy()

        keys = api.get_keys()

        if not isinstance(keys, list):
            return

        for key in keys:

            frame = ctk.CTkFrame(self.list)
            frame.pack(fill="x", pady=5)

            name = key.get("name", "Sem nome")
            value = key.get("key", "Sem chave")
            key_id = key.get("id")

            # NAME
            ctk.CTkLabel(
                frame,
                text=name
            ).pack(side="left", padx=15)

            # KEY VALUE
            ctk.CTkLabel(
                frame,
                text=value
            ).pack(side="left", padx=20)

            # COPY
            ctk.CTkButton(
                frame,
                text="Copiar",
                width=80,
                command=lambda v=value: self.copy_key(v)
            ).pack(side="right", padx=5)

            # DELETE
            ctk.CTkButton(
                frame,
                text="Excluir",
                width=80,
                command=lambda k=key_id: self.delete(k)
            ).pack(side="right", padx=5)

            # OPEN (AGORA ABRE DATASTORE REAL)
            ctk.CTkButton(
                frame,
                text="Open",
                width=80,
                command=lambda k=key_id: self.open_datastore(k)
            ).pack(side="right", padx=5)

    # =========================
    # CREATE KEY
    # =========================
    def create(self):

        name = self.entry.get().strip()

        if not name:
            return

        loader = Loader(self, "Creating API Key")

        loader.add("Connecting to server...")
        loader.add("Authenticating...")
        loader.add("Generating key...")
        loader.add("Saving database...")
        loader.add("Verifying...")
        loader.add("Refreshing...")

        loader.next()
        time.sleep(0.2)
        loader.success()

        loader.next()
        time.sleep(0.2)
        loader.success()

        loader.next()

        response = api.create_key(name)

        if not response.get("success"):
            loader.error("Failed to create key.")
            return

        loader.success()

        loader.next()
        loader.success()

        loader.next()

        self.refresh()

        loader.success()

        self.entry.delete(0, "end")

        loader.finish("Key created!")
        loader.after(800, loader.destroy)

    # =========================
    # DELETE KEY
    # =========================
    def delete(self, key_id):

        if not key_id:
            return

        api.delete_key(key_id)
        self.refresh()