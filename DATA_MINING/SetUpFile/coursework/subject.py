class Subject:
    def __init__(self, count, name, required, skill):
        self.id = count
        self.name = name
        self.required = required
        self.skill = skill

    def getId(self):
        return self.id

    def getName(self):
        return self.name.split(" - ")[0]

    def getRequired(self):
        return self.required

    def getSkill(self):
        return self.skill
