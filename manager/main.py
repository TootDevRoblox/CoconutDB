import customtkinter as ctk
from pages.keys import KeysPage

ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")


class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.geometry("1100x650")
        self.title("CoconutDB Manager")

        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.sidebar = ctk.CTkFrame(self, width=220, corner_radius=0)
        self.sidebar.grid(row=0, column=0, sticky="ns")

        ctk.CTkLabel(
            self.sidebar,
            text="🥥 CoconutDB",
            font=("Segoe UI", 22, "bold")
        ).pack(pady=30)

        ctk.CTkButton(
            self.sidebar,
            text="API Keys",
            command=self.open_keys
        ).pack(fill="x", padx=20, pady=8)

        self.content = ctk.CTkFrame(self)
        self.content.grid(row=0, column=1, sticky="nsew")

        self.page = None

        self.open_keys()

    def clear(self):
        if self.page:
            self.page.destroy()

    def open_keys(self):
        self.clear()
        self.page = KeysPage(self.content)
        self.page.pack(fill="both", expand=True)


app = App()
app.mainloop()