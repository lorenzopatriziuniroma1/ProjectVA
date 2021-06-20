import pandas as pd

"""df = pd.read_csv('ProjectVA/Ranking-2020-Coords.csv')
df.drop('Unnamed: 0', inplace=True, axis=1)
df.drop('Unnamed: 0.1', inplace=True, axis=1)
#df.drop('Unnamed: 0.1.1', inplace=True, axis=1)
df['anno'] ='2020'
df.to_csv('ProjectVA/Ranking-2020-Coords-clean.csv', index=False)
print(df) """

"""years=["2016","2018","2019"]
df = pd.read_csv('ProjectVA/Ranking-2020-Coords-clean.csv')
for y in years:
    name='ProjectVA/Ranking-'+y+'-Coords-clean.csv'
    df2 = pd.read_csv(name)
    df=df.append(df2)
print(df["anno"])
df.to_csv('ProjectVA/Ranking-Coords-clean.csv', index=False)"""

df = pd.read_csv('ProjectVA/Ranking-Coords-clean.csv')
print(df)