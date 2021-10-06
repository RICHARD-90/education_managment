# DOCUMENTATION
---
Created on Tue Jul  6 20:36:02 2021<br>
@author RICHARD N'DRI


## SUMMARY
---
1. Introduction
2. Installation & Environment
 

### Introduction
---
This project fits into the context of work related to the use of data in the field ofeducation,
known under the umbrella term of Learning Analytics. More precisely, the context of this project is that of the representation and analysis of the offers of
training (Curriculum Analytics).


### Installation & Environment
---

**Installation & programming environment**
---

Download the project as follows :
- create a directory 
- cd directoryName
- git clone https://github.com/RICHARD-90/Stage_ametys.git

Things to install: 
- [d3js](https://d3js.org/)
- [boostrap](https://getbootstrap.com/)
- many other library (take a look to the htmlFomat file for more informations)

*NB : There is no constraint on the programming environment.*


**How to use**
---
To use this code you just have to update the data of the json files.<br>
All functions are commented in order to make it easier for you to understand.<br>
This script is the result of a data mining work at the end of which we generate three json files stored in 'static/TOOLS':

                       file.json:
                       -----------
                            Description : contains the list of subjects and the list of prerequisite's relations
                            Format : {
                                    nodes : [
                                        {id : str,
                                        group : str},
                                        ...
                                        ],

                                     links : [
                                         {source : str,
                                          target : str,
                                          value : int},
                                           ...
                                        ]
                                }

                       skillData.json:
                       ----------------
                            Description : contains links between subject and skill
                            Format : {
                                    name : str (name of the coursework),
                                   children : list
                                        children is a list of object which have the same format.
                                }

                            Leaf : is an object which does not have a child
                            ------
                                Format : {
                                        name : str,
                                        value : int
                                            id of the skill level (value between 0 and 3)  
                                    }

                       skillComment.json:
                       -------------------
                            Description : contains the definitions of skills codes
                            Format : {
                                name : str (default value : 'skill_comment'),
                                set : [
                                    {name : str,
                                   value : str},
                                     ...
                                   ]
                                }
