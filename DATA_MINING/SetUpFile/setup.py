import re

from DATA_MINING.SetUpFile.coursework.coursework import Coursework
from DATA_MINING.SetUpFile.coursework.subject import Subject
from DATA_MINING.SetUpFile.utility.BDcreator import *
from DATA_MINING.SetUpFile.utility.textReader import *


class SetupFile:
    """

    """

    def __init__(self, filename):
        self.coursework = None
        self.text = filename
        if re.match("([a-zA-Z0-9_]*.text)", filename) is not None:
            creating_data_set(self.getTextContent())
            self.generate_coursework()

        else:
            print("your file is not a pdf")

    def setCoursework(self, coursework):
        self.coursework = coursework

    def getCoursework(self):
        return self.coursework

    def setTextContent(self, text):
        self.text = text

    def getTextContent(self):
        return self.text

    def generate_coursework(self):
        list_subject = generate_liste_subject(self.getTextContent())
        set_subject = []
        count = 0
        for subject in list_subject:
            count += 1
            list = []
            for module in list_subject:
                if is_in(module.split(" - ")[0], self.getTextContent()[0]):
                    list.append(module.split(" - ")[0])
            object_subject = Subject(count, subject, list,
                                     attributModule(subject, self.getTextContent())[1])
            set_subject.append(object_subject)
        self.setCoursework(Coursework(set_subject))

    def generate_coursework_bis(self):
        list_subject = generate_liste_subject(self.getTextContent())
