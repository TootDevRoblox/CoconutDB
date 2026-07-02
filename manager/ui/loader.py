import customtkinter as ctk


class Loader(ctk.CTkToplevel):

    def __init__(self, parent, title="Loading"):

        super().__init__(parent)

        self.title("CoconutDB")

        self.geometry("520x260")
        self.resizable(False, False)

        self.transient(parent)
        self.grab_set()

        self.steps = []
        self.current = -1

        self.titleLabel = ctk.CTkLabel(
            self,
            text=title,
            font=("Segoe UI", 24, "bold")
        )

        self.titleLabel.pack(pady=(20, 10))

        self.progress = ctk.CTkProgressBar(
            self,
            width=430,
            height=18
        )

        self.progress.pack()

        self.progress.set(0)

        self.status = ctk.CTkLabel(
            self,
            text="Preparing...",
            font=("Consolas", 15)
        )

        self.status.pack(pady=12)

        self.logs = ctk.CTkTextbox(
            self,
            width=450,
            height=110,
            font=("Consolas", 13)
        )

        self.logs.pack()

        self.logs.configure(state="disabled")

    def add(self, text):

        self.steps.append(text)

    def log(self, text):

        self.logs.configure(state="normal")

        self.logs.insert("end", text + "\n")

        self.logs.see("end")

        self.logs.configure(state="disabled")

        self.update()

    def next(self):

        self.current += 1

        if self.current >= len(self.steps):
            return

        text = self.steps[self.current]

        self.status.configure(text=text)

        percent = (self.current + 1) / len(self.steps)

        self.animate(percent)

        self.log("⟳ " + text)

    def success(self):

        lines = self.logs.get("1.0", "end").split("\n")

        if len(lines) < 2:
            return

        last = lines[-2]

        if last.startswith("⟳"):
            last = last.replace("⟳", "✓", 1)

        self.logs.configure(state="normal")

        self.logs.delete("end-2l", "end-1l")

        self.logs.insert("end", last + "\n")

        self.logs.configure(state="disabled")

        self.logs.see("end")

        self.update()

    def error(self, text):

        self.log("✗ " + text)

    def finish(self, text="Done"):

        self.progress.set(1)

        self.status.configure(text=text)

        self.update()

    def animate(self, target):

        current = self.progress.get()

        while current < target:

            current += 0.01

            if current > target:
                current = target

            self.progress.set(current)

            self.update()

            self.after(8)