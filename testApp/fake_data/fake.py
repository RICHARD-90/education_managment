from faker import Faker
import random
import json

"""
    subject_name : name
    semester : city
    skill : company
    skill_comment : text
    skill_value : [0, 1, 2, 3]
    
"""

fake = Faker()
level_id = [0, 1, 2, 3]

def generate_subject_name(nb = 67):
    """ 
        sets a list of subjet's name
        
        parameter : 
            nb : int
                number of subject we want to have
        return:
            list
    """
    list_of_subject = []
    for loop in range(nb):
        list_of_subject.append(fake.name().split(' ')[0])
    return list_of_subject

def generate_semester(nb = 6):
    """ 
        sets a list of semester
        
        parameter : 
            nb : int
                number of semester we want to have
        return:
            list
    """
    list_of_semester = []
    for loop in range(nb):
        list_of_semester.append(fake.city())
    return ['s5', 's6', 's7', 's8', "s9", 's10']

def generate_skill(nb = 24):
    """ 
        sets a list of skill
        
        parameter : 
            nb : int
                number of skill we want to have
        return:
            list
    """
    list_of_skill = []
    for loop in range(nb):
        list_of_skill.append(fake.company().split(" ")[0])
    return list_of_skill

# def generate_skill_comment(nb = 30):
#     """ 
#         sets a list of skill comment
        
#         parameter : 
#             nb : int
#                 number of skill comment we want to have
#         return:
#             list
#     """
#     list_of_skill_comment = []
#     for loop in range(nb):
#         list_of_skill_comment.append(fake.company())
#     return 

def nodes(data, semester):
    """
    """
    list_node = []
    for node_name in data:
        list_node.append({'id' : node_name, 'group' : semester[random.randint(0, len(semester)-1)]})
    return list_node

def sortNode(list_node, semester):
    result = []
    for val_sem in semester:
        cache = []
        for val in list_node:
            if val_sem == val['group']:
                cache.append(val)
        result += cache
    return result

def links(data):
    """
    """
    list_link = []
    for val in data:
        list_link.append({'source' : val, 'target' : data[random.randint(0, len(data)-1)], 'value' : fake.random_digit()})
    return list_link

def __generateFile__(data, semester):
    """
    """
    jsonObject = {'nodes' : sortNode(nodes(data, semester), semester), 'links' : links(data)}
    with open('static/TOOLS/fake_data/file.json', 'w') as file:
        json.dump(jsonObject, file)

def skill_children(skill_list):
    """
    """
    list_skill = []
    for loop in range(random.randint(1,10)):
        list_skill.append({'name' : skill_list[random.randint(0, len(skill_list)-1)], 'value' : level_id[random.randint(0, len(level_id))-1]})
    return list_skill
    
def __generateSkillData__(data, skill_list):
    """
    """
    list_son = []
    for val in data:
        list_son.append({'name' : val, 'children' : skill_children(skill_list)})
    objectSkill = {"name" : fake.state(), 'children' : list_son}
    with open("static/TOOLS/fake_data/skillData.json", 'w') as sk:
        json.dump(objectSkill, sk)
    

def skill_definition(skill_list):
    """
    """
    set_data = []
    for val in skill_list:
        set_data.append({'name' : val, 'value' : fake.text()})
    return set_data

def __skillComment__(skill_list):
    objectSkill = {"name" : 'skill_comment', 'set' : skill_definition(skill_list)}
    with open('static/TOOLS/fake_data/skillComment.json', 'w') as skc:
        json.dump(objectSkill, skc)
        

def main():
    data = generate_subject_name()
    semester = generate_semester() 
    skill_list = generate_skill()
    # start process
    __generateFile__(data, semester)
    __generateSkillData__(data, skill_list)
    __skillComment__(skill_list)
    