# Keystroke Loxensis Light

[![DOI](https://zenodo.org/badge/1164729401.svg)](https://doi.org/10.5281/zenodo.18788086)

This repository is a public template that allows you to recreate the visualisations offered by Keystroke Loxensis for your own writing processes. To make use of this template, you should have your own keystroke-logged writing processes &mdash; logged with a keystroke logger, such as [Inputlog](https://www.inputlog.net) or [GGXLog](https://www.ggxlog.net) &mdash; encoded in TEI-XML. The XML should be well-formed and must conform to the rules outlined in the [Encoding Manual for Keystroke Logging Data](https://extant-cmg.github.io/eXtant-wiki/loxensis/encoding). Make sure to use [this XML template](https://extant-cmg.github.io/eXtant-wiki/loxensis/encoding/start-file) as the start file for your encoding, this will ensure the metadata (names, session duration etc.) is shown in the visualisations.

## How to Create Your Own Visualisations with Keystroke Loxensis Light

### Quick Setup

1. [Use this template](https://github.com/new?template_name=Keystroke-Loxensis-Light&template_owner=eXtant-CMG) to create a new repository.
2. In your new repository, go to `Settings -> Actions -> General -> Workflow permissions` and give `Read and write permissions` to GitHub Actions.
3. Go to `Settings -> Pages -> Build and Deployment` and select `GitHub Actions` as source.
4. Replace the existing directories (`authorLastname`) in the `xml` folder with your own. Each directory in `xml` represents a collection of writing sessions of one particular writer/author. The folders should be given the lastname of the authors in your collection (e.g. `Smith`). This folder contains all the TEI-XML files, with the following file naming: (`authorLastname_version#_session#.xml`, e.g. `Smith_01_s01.xml`)
5. Commit and push your changes.

If you follow these steps correctly and in the right order, you will kickstart the deployment workflow and your visualisation environment will shortly be deployed to `https://[your-username].github.io/[your-repo-name]`.

### Local Development Server Setup

1. [Use this template](https://github.com/new?template_name=Keystroke-Loxensis-Light&template_owner=eXtant-CMG) to create a new repository.
2. Clone your repository to your local system.
4. Replace the existing directories (`authorLastname`) in the `xml` folder with your own. Each directory in `xml` represents a collection of writing sessions of one particular writer/author. The folders should be given the lastname of the authors in your collection (e.g. `Smith`). This folder contains all the TEI-XML files, with the following file naming: (`authorLastname_version#_session#.xml`, e.g. `Smith_01_s01.xml`)
5. Run the Python script `build_authors_json.py` from the root folder of the repository. This will update the `authors.json` file which is necessary for the program to work.
6. Start a local server (eg. [the VCS live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or a [simple Python HTTP server](https://realpython.com/python-http-server/)) and open `index.html` on a browser.

Keystroke Loxensis Light is developed by [Lamyk Bekius](https://www.uantwerpen.be/en/staff/lamyk-bekius/). The development of Keystroke Loxensis Light is funded by [CLARIAH-VL+](https://clariahvl.hypotheses.org) (Research Foundation Flanders - FWO International Research Infrastructures (I001525N)).