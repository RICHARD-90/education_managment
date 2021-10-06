import unittest
import sys
from SetUpFile.setup import *
from SetUpFile.utility.pdfExtractor import *
from SetUpFile.coursework.coursework import Coursework
from SetUpFile.coursework.subject import Subject
from SetUpFile.utility.BDcreator import creating_data_set
from SetUpFile.utility.textReader import *
sys.path.append("..")



text_creator(convert_pdf_to_string("Programme_IDU_2021_2025.pdf"))


class testModel(unittest.TestCase):

    def setUp(self):
        self.fileIDU = SetupFile("pdfContent.text")

    def typefile(self):
        self.assertIsInstance(self.fileIDU, SetupFile)

    def number_of_subject(self):
        self.assertEqual(len(self.fileIDU.getCoursework().getSubjects()), 65)


if __name__ == '__main__':
    unittest.main()
