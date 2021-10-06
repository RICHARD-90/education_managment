def semaphore_semester(text):
    """
        verifie si le texte fait reference a un semeste
    """
    if 'Semestre' in text:
        return True, text
    else:
        return False, None


def is_in(mot, text):
    """
        verifie si le mot est dans le texte
    """
    if mot in text:
        return True
    else:
        return False


def check_semester(text):
    """
        permet de detcter si le texte indique un semestre
    """
    if 'Semestre' in text:
        return True
    else:
        return False


def residue(text):
    """
        detecte si le texte comporte un \n
    """
    if '\n' in text:
        return True
    else:
        return False


def semaphore_ue(text):
    """
        permet de reconnaitre si un texte contient une UE ou pas
    """
    if 'UE' in text:
        textsplit = text.split('. ')[1]
        return (True, textsplit)
    else:
        return (False, None)


def check_glossary(text):
    """
        retourne True si le texte contient Glossaire
    """
    if 'Glossaire' in text:
        return True
    else:
        return False


def check_summary(text):
    """
        retourne True si le texte contient sommaire
    """
    if 'Table des matières' in text:
        return True
    else:
        return False


def summary_extracting(fichier):
    """
        permet d'extraire les donnée du sommaire
    """

    file = open(fichier, 'r')
    data1 = []
    capteur2 = 0
    capteur1 = False
    for line in file.readlines():
        if check_summary(line):
            capteur1 = True

        if check_glossary(line):
            capteur2 += 1

        if check_glossary(line) and capteur2 == 2:
            capteur1 = False

        if capteur1:
            data1.append(line)
    file.close()
    return data1


def data_summary_analysis(fichier):
    """
        analyse les donnée a l issue du traiment fait par sommaire_extracting(file)
    """
    # file = open(fichier, 'r')
    data1 = summary_extracting(fichier)
    data2 = []
    for data in data1:
        split_data = data.split(' .......')[0]
        data2.append(split_data)
    # file.close()
    return data2


def Module_court(module_long):
    """
        retourne la liste des modules de la formation avec les noms reduits
    """
    split_module = module_long.split(" - ")
    return split_module[0]


def UE_module_court(fichier):
    """
        permet de creer une relation entre les UE et les modules
    """

    # file = open(fichier, 'r')
    UEname = None
    data2 = data_summary_analysis(fichier)
    data3 = {}
    capteur3 = False
    for data in data2:
        if semaphore_ue(data)[0]:
            UEname = semaphore_ue(data)[1]
            data3.update({UEname: []})
            capteur3 = True
            continue

        if (check_semester(data)) or (residue(data)):
            capteur3 = False

        elif semaphore_ue(data)[0] and semaphore_ue(data)[1] != UEname:
            capteur3 = False

        if capteur3:
            data_m = data.split('. ')[1]
            data3.get(UEname).append(Module_court(data_m))
    # file.close()
    return data3


def ue_subject(fichier):
    """
        permet de creer une relation entre les UE et les modules
    """

    # file = open(fichier, 'r')
    UEname = None
    data2 = data_summary_analysis(fichier)
    data3 = {}
    capteur3 = False
    for data in data2:
        if semaphore_ue(data)[0]:
            UEname = semaphore_ue(data)[1]
            data3.update({UEname: []})
            capteur3 = True
            continue

        if (check_semester(data)) or (residue(data)):
            capteur3 = False

        elif semaphore_ue(data)[0] and semaphore_ue(data)[1] != UEname:
            capteur3 = False

        if capteur3:
            data_m = data.split('. ')[1]
            data3.get(UEname).append(data_m)
    # file.close()
    return data3


def semester_ue(fichier):
    """
        permet de creer une relation entre les semestre et les UE
    """

    # file = open(fichier, 'r')
    sem = None
    data2 = data_summary_analysis(fichier)
    capteur4 = False
    Semestre = {}
    for data in data2:

        if semaphore_semester(data)[0]:
            sem = str(semaphore_semester(data)[1])
            Semestre.update({sem: []})
            capteur4 = True
            continue

        if residue(data):
            capteur4 = False

        elif check_semester(data) and semaphore_semester(data)[1] != sem:
            capteur4 = False

        if capteur4 and semaphore_ue(data)[0]:
            data_m = data.split('. ')[1]
            Semestre.get(sem).append(data_m)
    # file.close()
    return Semestre


def generate_liste_subject(fichier):
    """
        retourne la liste des modules de la formation avec les noms entier
    """

    # file = open(fichier, 'r')
    ue = ue_subject(fichier)
    module = list()
    for terme in ue.items():
        module += terme[1]

    # file.close()
    return module


def list_Module_court(fichier):
    """
        retourne la liste des modules de la formation avec les noms entier
    """

    # file = open(fichier, 'r')
    ue = ue_subject(fichier)
    module = list()
    for terme in ue.items():
        for name_module in terme[1]:
            name = name_module.split(" - ")[0]
            module.append(name)
        # print(module)
    # file.close()
    return module


# test
# print(list_Module_court(text))


def attributModule(module, fichier):
    """
        retourne les prerequis du modules
    """

    file = open(fichier, 'r')
    pre = ''
    comp = ''
    compteur = 0
    compte = 0

    # les capteurs
    capteur5 = False
    capteur6 = False
    capteur_pre = False
    capteur_comp = False

    for line in file.readlines():
        compte += 1
        # print(line)
        # debut de l'analyse
        if is_in("Semestre 5", line):
            capteur5 = True
            continue

        # on retrouve me module
        if is_in(module, line) and capteur5:
            capteur6 = True
            continue
        # capteur prerequis
        if is_in('Pré-requis', line) and capteur6:
            capteur_pre = True
            compteur += 1
            continue

        if is_in('Descriptif', line) and capteur6:
            capteur_pre = False
            continue

        # capteur Competence
        if is_in("Objectifs d'apprentissage", line) and capteur6:
            capteur_comp = True
            compteur += 1
            continue

        if (is_in("Bibliographie", line) or is_in('Niveau', line)) and capteur6:
            capteur_comp = False
            continue

        if (compteur == 2) and (capteur_pre is False) and (capteur_comp is False):
            capteur6 = False

        if capteur5:
            if capteur6:
                if capteur_pre:
                    pre += line
                if capteur_comp:
                    comp += line
    file.close()
    # print(capteur5, capteur6, capteur_pre, capteur_comp, compteur, compte)
    return pre, comp


def subject_link(fichier):
    """
        permet d'etablir la relation entre les modules (x module est un prerequis de y module)
    """
    file = open(fichier, 'r')
    relation = {}
    modules = generate_liste_subject(fichier)
    for module in modules:
        relation.update({module: []})
        # prerequis du module
        pre_module = attributModule(module, fichier)[0]
        for module_prime in modules:
            # abreviation du module
            abre_module_prime = module_prime.split(' - ')[0]
            if is_in(abre_module_prime, pre_module):
                relation.get(module).append(module_prime)
    file.close()
    return relation


def get_module_id(name, liste):
    subjects = liste
    for node in subjects:
        if name == node.getName().split(" - ")[0]:
            return node.getId()