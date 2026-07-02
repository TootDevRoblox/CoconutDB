import customtkinter as ctk
import api


class DatastoreView(ctk.CTkFrame):

    def __init__(self, master, datastore_name):
        super().__init__(master)

        self.datastore_name = datastore_name

        title = ctk.CTkLabel(
            self,
            text=f"Datastore: {datastore_name}",
            font=("Segoe UI", 24, "bold")
        )
        title.pack(anchor="w", padx=20, pady=20)

        self.list = ctk.CTkScrollableFrame(self)
        self.list.pack(fill="both", expand=True, padx=20, pady=10)

        self.refresh()

    def refresh(self):

        for w in self.list.winfo_children():
            w.destroy()

        docs = api.get_documents(self.datastore_name)

        for doc in docs:

            frame = ctk.CTkFrame(self.list)
            frame.pack(fill="x", pady=5)

            ctk.CTkLabel(
                frame,
                text=f"Name: {doc['name']}"
            ).pack(side="left", padx=10)

            ctk.CTkLabel(
                frame,
                text=f"Value: {doc['value']}"
            ).pack(side="left", padx=10)