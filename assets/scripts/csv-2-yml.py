# csv-2-yml.py
# ============
# Takes all data from raw csv files from
# https://github.com/snap-hackathon/snapshot-texas/blob/master/csv
# and generates YML data files that can be digested by the liquid templates on
# the Feeding Texas site.
#
# Each YML file contains all the data necessary to render a detail page for a
# single zip code.

import csv

# Globals
COUNTY_ZIP_MAP = {}

def build_county_zip_map():
  # necessary to modify gloabal within function
  global COUNTY_ZIP_MAP
  with open('Texas_Zip_codes.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line
    next(csvreader)
    # loop over all rows in csv file
    for row in csvreader:
      # use 'county' as key and set 'zip' to list of zip codes in given county
      if not(row[2].lower() in COUNTY_ZIP_MAP):
        COUNTY_ZIP_MAP[row[2].lower().strip()] = [row[3].strip()]
      else:
        COUNTY_ZIP_MAP[row[2].lower().strip()].append(row[3].strip())
  return COUNTY_ZIP_MAP

def build_zip_var():
  '''
  Builds master dictionary with zip codes as keys and values as a dictionary 
  with county name as initial item in the dict.

  E.g. zip_dict['75001']['county'] yields 'addison'

  Each attribute of a zip code will be referencable this way and the name of
  the attribute in this dictionary will coincide with the name of the
  frontmatter variable.
  '''
  with open('Texas_Zip_codes.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line in csv
    next(csvreader)
    # init empty return dict
    zip_county = {}
    # loop over all rows in csv file
    for row in csvreader:
      # use 'zip' as key and grab and set 'county' to its own dict
      zip_county[row[3].strip()] = {
        'county': row[2].lower().strip(), 
        'zip': row[3].strip(),
        # set latitude and longitude to be used for map marker creation
        'latitude': row[4].strip(),
        'longitude': row[9].strip(),
      }
      # if zip code has a polygon, include it
      if row[11]:
        poly = row[11].strip()
        # remove leading and trailing tags as well as third unnecessary 0.0 coordinate
        replace_patterns = ['<Polygon>', '<outerBoundaryIs>', '<LinearRing>', '<coordinates>', '<MultiGeometry>', '</coordinates>', '</LinearRing>', '</outerBoundaryIs>', '</Polygon>', '</MultiGeometry>']
        for i in replace_patterns:
          poly = poly.replace(i, '')
        # explode into array on spaces
        coord_sets = poly.split(',0.0')
        zip_county[row[3].strip()]['polygonCoords'] = coord_sets
  return zip_county

def add_overview(zip_var):
  with open('Food_Banks.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line in csv
    next(csvreader)
    # array for county names found in data that are not in Texas_Zip_codes.csv
    missing_zips = []
    fffound = []
    for row in csvreader:
      if not(row[0].lower().strip() in COUNTY_ZIP_MAP):
        missing_zips.append(row[0].lower().strip())
      else:
        fffound.append(row[0].lower().strip())
        for zip_code in COUNTY_ZIP_MAP[row[0].lower().strip()]:
          zip_var[zip_code]['foodBank'] = row[1].strip()
          zip_var[zip_code]['website'] = row[4].strip()

  with open('Food_Insecurity.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line in csv
    next(csvreader)
    # array for county names found in data that are not in Texas_Zip_codes.csv
    missing_zips = []
    fffound = []
    for row in csvreader:
      if not(row[0].lower().strip() in COUNTY_ZIP_MAP):
        missing_zips.append(row[0].lower().strip())
      else:
        fffound.append(row[0].lower().strip())
        for zip_code in COUNTY_ZIP_MAP[row[0].lower().strip()]:
          zip_var[zip_code]['individualFoodInsecurityRate'] = row[1].strip()
          zip_var[zip_code]['childFoodInsecurityRate'] = row[3].strip()
          zip_var[zip_code]['foodInsecureChildren'] = row[4].strip()
          zip_var[zip_code]['costOfFoodIndex'] = row[5].strip()
          zip_var[zip_code]['weightedCostPerMeal'] = row[6].strip()
  
  return zip_var

def add_eligibility(zip_var):
  with open('SNAP_Eligibility_vs_Participation_plus_SNAP_meals.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over header line
    next(csvreader)
    # array for zip codes found in data that are not in Texas_Zip_codes.csv
    # missing_zips = []
    for row in csvreader:
      # this should not happen, but it does because Texas_Zip_codes.csv does not
      # include entries for all zips there are data for
      if not(row[2].strip() in zip_var):
        # missing_zips.append((row[2], row[0]))
        zip_var[row[2].strip()] = {'county': row[0].lower().strip(), 'zip': row[2].strip()}  
      zip_var[row[2]]['totalSnapRecipients'] = row[6].strip()
      zip_var[row[2]]['averageBenefitperMeal'] = row[8].strip()
      zip_var[row[2]]['totalIncomeEligibleIndividuals'] = row[12].strip()
      zip_var[row[2]]['incomeEligible0To17'] = row[13].strip()
      zip_var[row[2]]['incomeEligible18To64'] = row[14].strip()
      zip_var[row[2]]['incomeEligible65Plus'] = row[15].strip()
      zip_var[row[2]]['totalIncomeEligibleButNotReceiving'] = row[16].strip()
      zip_var[row[2]]['incomeEligibleButNotReceiving0To17'] = row[17].strip()
      zip_var[row[2]]['incomeEligibleButNotReceiving18To64'] = row[18].strip()
      zip_var[row[2]]['incomeEligibleButNotReceiving65Plus'] = row[19].strip()
  return zip_var

def add_demographics(zip_var):
  with open('SNAP_Particpation_and_Race_Merged.csv', 'rU') as csvfile:
    csvreader = csv.reader(csvfile)
    # skip over 3 header lines
    for i in range(3):
      next(csvreader)
    # array for zip codes found in data that are not in Texas_Zip_codes.csv
    # missing_zips = []
    for row in csvreader:
      # this should not happen, but it does because Texas_Zip_codes.csv does not
      # include entries for all zips there are data for
      if not(row[2].strip() in zip_var):
        # missing_zips.append((row[2], row[0]))
        zip_var[row[2].strip()] = {'county': row[0].lower().strip(), 'zip': row[2].strip()}  
      zip_var[row[2]]['recipients0To17'] = row[7].strip()
      zip_var[row[2]]['recipients18To64'] = row[8].strip()
      zip_var[row[2]]['recipients65Plus'] = row[9].strip()
      zip_var[row[2]]['recipientRaceNativeAmerican'] = row[22].strip()
      zip_var[row[2]]['recipientRaceAsian'] = row[23].strip()
      zip_var[row[2]]['recipientRaceBlack'] = row[24].strip()
      zip_var[row[2]]['recipientRacePacificIslander'] = row[25].strip()
      zip_var[row[2]]['recipientRaceWhite'] = row[26].strip()
      zip_var[row[2]]['recipientRaceMultiRace'] = row[27].strip()
      zip_var[row[2]]['recipientRaceUnknownMissing'] = row[28].strip()
      zip_var[row[2]]['recipientEthnicityHispanic'] = row[29].strip()
      zip_var[row[2]]['recipientEthnicityNonHispanic'] = row[30].strip()
      zip_var[row[2]]['recipientEthnicityUnknownMissing'] = row[31].strip()
      zip_var[row[2]]['householdIncomeWithEarnedIncome'] = row[32].strip()
  return zip_var

def write_yml_files(zip_var):
  import os;
  import shutil;
  if os.path.isdir('_counties'):
    # sys.exit('Manually remove "_counties" dir before proceeding.')
    shutil.rmtree('_counties')
  os.mkdir('_counties')
  os.chdir('_counties')
  # write a markdown file for each zip code
  for zip_code in zip_var.keys():
    with open(zip_code + '.markdown', 'w') as outfile:
      # begin yml frontmatter
      outfile.write('---\n')
      # write static variables we want for all county items to frontmatter
      outfile.write('collection: counties\n')
      outfile.write('layout: county\n')
      # write data from csv files to frontmatter
      variables = zip_var[zip_code].keys()
      variables.sort()
      for var in variables:
        if var == 'polygonCoords':
          outfile.write(var + ':\n')
          for i in zip_var[zip_code][var]:
            if i:
              outfile.write(  '  - coordSet:\n')
              lon, lat = i.split(',')
              outfile.write('    latitude: ' + lat.strip() + '\n')
              outfile.write('    longitude: ' + lon.strip() + '\n')
          continue
        outfile.write(var + ': ' + zip_var[zip_code][var] + '\n')
      # end yml frontmatter
      outfile.write('---\n')


if __name__ == '__main__':
  # build COUNTY_ZIP_MAP so we can get data for zip codes based on county name.
  # some csv files don't have a zip column so we have to use county.
  # TODO this map is likel incomplete
  global COUNTY_ZIP_MAP
  COUNTY_ZIP_MAP = build_county_zip_map()
  # initialize master data dict
  zip_var = build_zip_var()
  zip_var = add_overview(zip_var)
  zip_var = add_eligibility(zip_var)
  zip_var = add_demographics(zip_var)
  write_yml_files(zip_var)
