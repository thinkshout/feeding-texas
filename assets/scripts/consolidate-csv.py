# consolidate-csv.py
# ============
# Takes data from raw csv files from
# https://github.com/snap-hackathon/snapshot-texas/blob/master/csv
# and generates "master" csv files for two categories of data: zip specific and
# county (generic).
#
# The county data has to be mapped to the specific zip code pages in a many to
# one fashion.

import csv


def gen_county_data_csv():
  county_data = {}
  with open('Food_Insecurity.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line in csv
    next(csvreader)
    for row in csvreader:
      county = row[0].lower().strip()
      if not (county in county_data):
        county_data[county] = {}
      county_data[county]['individualFoodInsecurityRate'] = row[1].strip()
      county_data[county]['childFoodInsecurityRate'] = row[3].strip()
      county_data[county]['foodInsecureChildren'] = row[4].strip()
      county_data[county]['costOfFoodIndex'] = row[5].strip()
      county_data[county]['weightedCostPerMeal'] = row[6].strip().replace('$', '')

  with open('Food_Banks.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line in csv
    next(csvreader)
    for row in csvreader:
      # remove unix whitespace chars
      county = row[0].replace('\xa0','').lower().strip()
      if not (county in county_data):
        county_data[county] = {}
      county_data[county]['foodBank'] = row[1].strip()
      county_data[county]['address'] = row[2].strip()
      county_data[county]['phone'] = row[3].strip()
      county_data[county]['website'] = row[4].strip()

  with open('county-data.csv', 'w') as outfile:
    # write first header cell
    outfile.write('county,')
    # write rest of header cells
    for i, key in enumerate(sorted(county_data['anderson'].keys())):
      if i == (len(county_data['anderson']) - 1):
        outfile.write(key)
      else:
        outfile.write(key + ',')
    outfile.write('\n')
    # for each county write column data
    for county in county_data.keys():
      # start with county name
      outfile.write(county + ',')
      # rest of data from hash w/ county name as key
      for i, key in enumerate(sorted(county_data[county].keys())):
        if i == (len(county_data[county]) - 1):
          outfile.write(county_data[county][key].replace(',','').replace('%',''))
        elif key == 'address':
          # preserve commas in address - wrap in quotes to not confuse ruby parser
          outfile.write('"' + county_data[county][key] + '",')
        else:
          # remove commas and percent symbols from numerical data
          outfile.write(county_data[county][key].replace(',','').replace('%','') + ',')
      outfile.write('\n')


def gen_zip_data_csv():
  zip_data = {}
  with open('SNAP_Eligibility_vs_Participation_plus_SNAP_meals.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line
    next(csvreader)
    for row in csvreader:
      zipcode = row[2].strip()
      if not(zipcode in zip_data):
        zip_data[zipcode] = {}
      zip_data[zipcode]['county'] = row[0].lower().strip()
      zip_data[zipcode]['totalSnapRecipients'] = row[6].strip()
      zip_data[zipcode]['averageBenefitperMeal'] = row[8].strip().replace('$', '')
      zip_data[zipcode]['totalIncomeEligibleIndividuals'] = row[12].strip()
      zip_data[zipcode]['incomeEligible0To17'] = row[13].strip()
      zip_data[zipcode]['incomeEligible18To64'] = row[14].strip()
      zip_data[zipcode]['incomeEligible65Plus'] = row[15].strip()
      zip_data[zipcode]['totalIncomeEligibleButNotReceiving'] = row[16].strip()
      zip_data[zipcode]['incomeEligibleButNotReceiving0To17'] = row[17].strip()
      zip_data[zipcode]['incomeEligibleButNotReceiving18To64'] = row[18].strip()
      zip_data[zipcode]['incomeEligibleButNotReceiving65Plus'] = row[19].strip()
  
  with open('SNAP_Particpation_and_Race_Merged.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line
    next(csvreader)
    for row in csvreader:
      zipcode = row[2].strip()
      if not(zipcode in zip_data):
        zip_data[zipcode] = {}
      zip_data[zipcode]['recipients0To17'] = row[7].strip()
      zip_data[zipcode]['recipients18To64'] = row[8].strip()
      zip_data[zipcode]['recipients65Plus'] = row[9].strip()
      zip_data[zipcode]['recipientRaceNativeAmerican'] = row[22].strip()
      zip_data[zipcode]['recipientRaceAsian'] = row[23].strip()
      zip_data[zipcode]['recipientRaceBlack'] = row[24].strip()
      zip_data[zipcode]['recipientRacePacificIslander'] = row[25].strip()
      zip_data[zipcode]['recipientRaceWhite'] = row[26].strip()
      zip_data[zipcode]['recipientRaceMultiRace'] = row[27].strip()
      zip_data[zipcode]['recipientRaceUnknownMissing'] = row[28].strip()
      zip_data[zipcode]['recipientEthnicityHispanic'] = row[29].strip()
      zip_data[zipcode]['recipientEthnicityNonHispanic'] = row[30].strip()
      zip_data[zipcode]['recipientEthnicityUnknownMissing'] = row[31].strip()
      zip_data[zipcode]['householdIncomeWithEarnedIncome'] = row[32].strip()

  with open('Texas_Zip_codes.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line in csv
    next(csvreader)
    for row in csvreader:
      zipcode = row[3].strip()
      # ignore zips we don't have in other data files
      if not(zipcode in zip_data):
        continue
      if not(row[4] and row[9]):
        zip_data[zipcode]['latitude'] = ''
        zip_data[zipcode]['longitude'] = ''
        zip_data[zipcode]['polygonCoords'] = ''
        continue
      # set latitude and longitude to be used for map marker creation
      zip_data[zipcode]['latitude'] = row[4].strip()
      zip_data[zipcode]['longitude'] = row[9].strip()
      # if zip code has a polygon, include it
      if not(row[11]):
        zip_data[zipcode]['polygonCoords'] = ''
        continue
      poly = row[11].strip()
      # remove leading and trailing tags as well as third unnecessary 0.0 coordinate
      replace_patterns = ['<Polygon>', '<outerBoundaryIs>', '<LinearRing>', '<coordinates>', '<MultiGeometry>', '</coordinates>', '</LinearRing>', '</outerBoundaryIs>', '</Polygon>', '</MultiGeometry>']
      for i in replace_patterns:
        poly = poly.replace(i, '')
      # explode into array on spaces
      coord_sets = poly.split(',0.0')
      # remove last item as it is empty 
      coord_sets = coord_sets[:-1]
      # remove leading/trailing whitespace
      coord_sets = [i.strip() for i in coord_sets]
      zip_data[zipcode]['polygonCoords'] = '"' + str(coord_sets) + '"'

  with open('zip-data.csv', 'w') as outfile:
    outfile.write('zip,')
    for i, key in enumerate(sorted(zip_data['75803'].keys())):
      if i == (len(zip_data['75803']) - 1):
        outfile.write(key)
      else:
        outfile.write(key + ',')
    outfile.write('\n')
    for zipcode in zip_data.keys():
      outfile.write(zipcode + ',')
      # if zip code not in Texas_Zip_codes.csv we need to add dummy hash elements
      if not(len(zip_data[zipcode]) == 28):
        zip_data[zipcode]['latitude'] = ''
        zip_data[zipcode]['longitude'] = ''
        zip_data[zipcode]['polygonCoords'] = ''
      for i, key in enumerate(sorted(zip_data[zipcode].keys())):
        if i == (len(zip_data[zipcode]) - 1):
          outfile.write(zip_data[zipcode][key].replace(',','').replace('%','').replace('$',''))
        elif key == 'polygonCoords':
          outfile.write(zip_data[zipcode][key] + ',')
        else:
          outfile.write(zip_data[zipcode][key].replace(',','').replace('%','').replace('$','') + ',')
      outfile.write('\n')


if __name__ == '__main__':
  # generate county-data.csv file out of SNAPshot repo csv files with only county data
  gen_county_data_csv()
  # generate zip-data.csv file out of SNAPshot repo csv files with with zip specific data
  gen_zip_data_csv()
