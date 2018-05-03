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

data_matrix = np.ndarray(shape=(len(data), 11), dtype=object)

for i in range(len(data)):
    auxExp = experienceCalculator(data[i]['experience'])
    data_matrix[i,0] = auxExp[0]
    data_matrix[i,1] = auxExp[1]
    data_matrix[i,2] = auxExp[2]
    data_matrix[i,3] = len(data[i]['languages'])
    if ('projects' in data[i]):
        data_matrix[i,4] = len(data[i]['projects'])
    else:
        data_matrix[i,4] = 0
    data_matrix[i,5] = len(data[i]['skills'])
    data_matrix[i,6] = len(data[i]['certificates'])
    data_matrix[i,7] = len(data[i]['awards'])
    data_matrix[i,8] = len(data[i]['beneficCauses'])
    data_matrix[i,9] = len(data[i]['recommendations'])
    data_matrix[i,10] = 0

#clf = joblib.load('/Users/robertollopcardenal/Desktop/TFG/MLP/TLServer/resources/AdaBest.pkl', 'r')
clf = joblib.load('/Users/robertollopcardenal/Desktop/TFG/MLP/TLServer/resources/Random.pkl', 'r')
prediction_matrix = np.ndarray(shape=(len(data), 2), dtype=object)
for i in range(len(data)):
    if ('linkedinId' in data[i]):
        prediction_matrix[i][0] = data[i]['linkedinId']
    else:
        prediction_matrix[i][0] = "No ID"
    prediction_matrix[i][1] = int(clf.predict(data_matrix[i,:].reshape(1, -1)))
    #print data[i]['label']

#print prediction_matrix
data_out = []
for i in range(prediction_matrix.shape[0]):
    data_outi = {}
    data_outi['linkedinId'] = prediction_matrix[i][0]
    data_outi['prediction'] = "refuse" if prediction_matrix[i][1] == 0 else "accept"
    data_out.append(data_outi)

print json.dumps(data_out)