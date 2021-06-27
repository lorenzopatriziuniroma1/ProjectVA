import pandas as pd

"""df = pd.read_csv('ProjectVA/Ranking-2020-Coords.csv')

df.drop('Unnamed: 0.1', inplace=True, axis=1)
#df.drop('Unnamed: 0.1.1', inplace=True, axis=1)
df['anno'] ='2020'
df.to_csv('ProjectVA/Ranking-2020-Coords-clean.csv', index=False)
print(df) """

"""years=["2016","2018","2019","2020"]
#df = pd.read_csv('ProjectVA/Ranking-2020-Coords-clean.csv')
for y in years:
    name='ProjectVA/Ranking-'+y+'-Coords-clean.csv'
    df2 = pd.read_csv(name)
    #df2.rename(columns=lambda x: x.replace(" ",""))
    #df2.to_csv("ProjectVA/standard/Ranking-"+y+"-Coords-clean.csv",index=False)

years=["2016","2018","2019"]
df = pd.read_csv("ProjectVA/standard/Ranking-2020-Coords-clean.csv")
for y in years:
    name='ProjectVA/standard/Ranking-'+y+'-Coords-clean.csv'
    df2 = pd.read_csv(name)
    df=df.append(df2)

df.to_csv('ProjectVA/Ranking-Coords-clean.csv',index=False)"""

name="ProjectVA\pca_csv\pca_year"
years=["2016.csv","2018.csv","2019.csv","2020.csv"]
df_f=[]
for year in years:
    path=name+year
    df=pd.read_csv(path)

    head=["country"]
    for name in df.columns:
        head.append(name+"_count")
        head.append(name+"_mean")        
    groups=df.groupby(['Country']).agg(["count","mean"])
    ##groups["Country"]=df[["Country"]].groupby(['Country'])
    print(groups)
    groups.reset_index().to_csv("ProjectVA\pca_csv\pca_year_group2_"+year,index=False,header=head)