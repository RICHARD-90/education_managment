from pyvis.network import Network
import webbrowser as w
from SetUpFile.coursework.datasetRequired import prerequis
from SetUpFile.coursework.datasetSkill import creating_data
from SetUpFile.coursework.skillSet import list_skill
from SetUpFile.utility.textReader import get_module_id


class Coursework:
    def __init__(self, list_subject):
        self.subjects = list_subject
        self.visualisation_required()
        self.visualisation_skill()

    def getSubjects(self):
        return self.subjects

    def visualisation_required(self):
        net = Network(height='100%', width='100%', bgcolor='#222222', font_color='white')
        for sub in self.getSubjects():
            net.add_node(sub.getId(), sub.getName())

        for v_sub in prerequis:
            net.add_edge(get_module_id(v_sub[0], self.getSubjects()), get_module_id(v_sub[1], self.getSubjects()),
                         weight=1)
        net.show("prerequis.html")
        w.open("prerequis.html")

    def visualisation_skill(self):
        net = Network(height='100%', width='100%', bgcolor='#222222', font_color='white')
        for skill_node in list_skill:
            net.add_node(skill_node.getId(), skill_node.getName(), size=30, color="#00ff1e")

        for sub in creating_data():
            net.add_node(sub.getId(), sub.getName())
            for link in sub.getSkill():
                net.add_edge(sub.getId(), link, weight=1)
        net.show("skill.html")
        w.open("skill.html")
