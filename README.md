# Set Up Baseline Grid

The script ‘setUpBaselineGrid.jsx’ simplifies the setup of baseline grids and type area in Adobe InDesign.

<img width="1920" alt="set-up-baseline-grid" src="https://github.com/user-attachments/assets/3c304f10-9263-4b1d-97bf-c992f0cada23">

## Usage

[Video on Vimeo](https://vimeo.com/229633717) (Version 3.0).
[Video on Vimeo](https://vimeo.com/193230796) (Version 2.1).

### Input fields

The values can be entered in the input fields with and without units (e.g. 13 pt). 
			
The values can be increased/decreased using the arrow keys. The values (increments) are read from the document from the default settings of the document.
			
#### Script input field: `Baseline grid` → `Values` → `Start:` 

Step size from the InDesign default settings: `Units and Increments` → `Keyboard Increments` → `Cursor Key`
			
#### Script input field: `Baseline grid` → `Values` -> `Increment every:` 

Step size from the InDesign preferences: `Units and Increments` → `Keyboard Increments` → `Size/Leading`
			
### Shift key pressed

Increment is increased/decreased by a factor of 10.

### Shift + cmd key pressed

Increment/decrement by a factor of 0.1.
			
#### Script input field: `Baseline grid` → `Values` → `Start:`

If `Shift` + `Crtl` + `Arrow key` are pressed simultaneously, the value in the input field is increased/decreased by the amount of one line spacing.
				 
#### Script input fields for manual input of the bars (margins)

**Single-click** on the field label to select the value in the input field.

**Double-click** on the field label also rounds the value in the input field.
				 
#### Script button: `Transfer values to applied parent page`

With `Shift` + click the values for facing pages can be transferred to both parent pages.

With `Alt` + click a selection dialog with all parent pages appears.
				 
#### Select `Active page` 

If no icon is selected, InDesign determines the active page (i.e. the page in the centre of the layout window). InDesign also selects the active page if there are more than two pages per print sheet or if a right or left page is missing.

## Project Octopus

The script is also part of the [Octopus project](https://www.project-octopus.net/script-setup-baselinescript/)

## Creativ Common Lizenz

The script may be used for commercial and non-commercial purposes (Creative Commons Licence: CC BY 3.0 AT). Use the script at your own risk.

If you redistribute or use the JavaScript code, please credit: Roland Dreger (www.rolanddreger.net)
