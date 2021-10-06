from DATA_MINING.SetUpFile.setup import SetupFile
from DATA_MINING.SetUpFile.utility.pdfExtractor import text_creator, convert_pdf_to_string

text_creator(convert_pdf_to_string("Programme_IDU_2021_2025.pdf"))
fileIDU = SetupFile("pdfContent.text")



