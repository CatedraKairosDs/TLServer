# coding=utf-8
from sklearn.externals import joblib
import json
import sys
import numpy as np
import re
import os
from collections import Counter
import math
import warnings
warnings.filterwarnings('ignore')

data = json.loads(sys.argv[1])

def experienceCalculator(exp):
    keyWords = [r"front", r"UX", r"front end", r"back", r"frontend", r"web", r"aplicaciones", r"tester", r"application", r"programador", r"developer", r"development", r"software engineer", r"software", r"programador", r"programadora", r"full stack", r"fullstack", r"back end", r"backend", r"devops", r"sysadmin", r"head", r"analista programador", r"desarrollador", r"scrum", r"agile", r"scrum master", r"agile coach"]
    #badWords = [r".NET"]
    totalExperience = 0
    totalExperienceArray = []
    nJobs = 0
    #pdb.set_trace()
    for experience in exp:
        counts = False
        for keyWord in keyWords:
            counts = counts or (re.search(keyWord, experience["jobName"].replace('-',' ').replace('/', ' '), flags=re.IGNORECASE) != None)
            counts = counts or (re.search(keyWord, experience["jobDescription"].replace('-',' ').replace('/', ' '), flags=re.IGNORECASE) != None)
            counts = counts or (re.search(keyWord, experience["company"].replace('-',' ').replace('/', ' '), flags=re.IGNORECASE) != None)
        if (counts):
            nJobs = nJobs+1
            if (re.search(r"[0-9]+", experience["howMuch"].encode('utf-8')) != None):
                if (re.search(r"[año]", experience["howMuch"].encode('utf-8')) != None):
                    if (len(experience["howMuch"].split()) > 2):
                        totalExperience += 12*int(experience["howMuch"].split()[0][1:]) + int(experience["howMuch"].split()[3])
                        totalExperienceArray.append(12*int(experience["howMuch"].split()[0][1:]) + int(experience["howMuch"].split()[3]))
                    else:
                        totalExperience += 12*int(experience["howMuch"].split()[0][1:])
                        totalExperienceArray.append(12*int(experience["howMuch"].split()[0][1:]))
                else:
                    if (len(experience["howMuch"].split()) != 0):
                        totalExperience += int(experience["howMuch"].split()[0][1:])
                        totalExperienceArray.append(int(experience["howMuch"].split()[0][1:]))
    if nJobs == 0:
        experienceData = Counter(totalExperienceArray)
        return (totalExperience, nJobs, int(0))
    else:
        experienceData = Counter(totalExperienceArray)
        if math.isnan(np.median(totalExperienceArray)):
            return (totalExperience, nJobs, int(0))            
        else:
            return (totalExperience, nJobs, int(np.median(totalExperienceArray)))

## Keys: experience, nJobs, meanTimePerJob, languages, projects, skills, certificates, awards, beneficCauses, recommendations

#data_matrix = np.ndarray(shape=(len(data), 11), dtype=object)
data_aux = np.ndarray(shape=(11), dtype=object)
#for i in range(len(data)):
auxExp = experienceCalculator(data['experience'])
data_aux[0] = auxExp[0]
data_aux[1] = auxExp[1]
data_aux[2] = auxExp[2]
data_aux[3] = len(data['languages'])
if ('projects' in data):
    data_aux[4] = len(data['projects'])
else:
    data_aux[4] = 0
data_aux[5] = len(data['skills'])
data_aux[6] = len(data['certificates'])
data_aux[7] = len(data['awards'])
data_aux[8] = len(data['beneficCauses'])
data_aux[9] = len(data['recommendations'])
data_aux[10] = 0

#clf = joblib.load('/Users/robertollopcardenal/Desktop/TFG/MLP/TLServer/resources/AdaBest.pkl', 'r')
clf = joblib.load('/Users/robertollopcardenal/Desktop/TFG/MLP/TLServer/resources/Random.pkl', 'r')
prediction_matrix = np.ndarray(shape=(2), dtype=object)
#for i in range(len(data)):
if ('linkedinId' in data):
    prediction_matrix[0] = data['linkedinId']
else:
    prediction_matrix[0] = "No ID"
prediction_matrix[1] = int(clf.predict(data_aux.reshape(1, -1)))
    #print data['label']
#print prediction_matrix
#data_out = []
#for i in range(prediction_matrix.shape[0]):
data_outi = {}
data_outi['linkedinId'] = prediction_matrix[0]
data_outi['prediction'] = "refuse" if prediction_matrix[1] == 0 else "accept"
    #data_out.append(data_outi)

print json.dumps(data_outi)