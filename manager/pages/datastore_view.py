import customtkinter as ctk
import api


class DatastoreView(ctk.CTkFrame):

    def __init__(self, master, datastore_id):
        super().__init__(master)

        self.datastore_id = datastore_id

        title = ctk.CTkLabel(
            self,
            text=f"Datastore: {datastore_id}",
            font=("Segoe UI", 24, "bold")
        )
        title.pack(anchor="w", padx=20, pady=20)

        self.list = ctk.CTkScrollableFrame(self)
        self.list.pack(fill="both", expand=True, padx=20, pady=10)

        self.refresh()
    def refresh(self):

        for w in self.list.winfo_children():
            w.destroy()

        docs = api.get_documents(self.datastore_id)

        if not isinstance(docs, list):
            print("DEBUG docs:", docs)
            return

        for doc in docs:

            if not isinstance(doc, dict):
                continue

            name = doc.get("name", "unknown")
            value = doc.get("value", {})

            frame = ctk.CTkFrame(self.list)
            frame.pack(fill="x", pady=5)

            ctk.CTkLabel(
                frame,
                text=f"Name: {name}"
            ).pack(side="left", padx=10)

            ctk.CTkLabel(
                frame,
                text=f"Value: {value}"
            ).pack(side="left", padx=10)