# Snapshot Capture Script

This script is designed to capture snapshots from multiple network video recorders (NVRs) and save them to a specified directory. It utilizes various Node.js modules to achieve the functionality, such as `request`, `fs`, `mkdirp`, `path`, `cron`, and `child_process`.

## Prerequisites

Before running this script, ensure that you have the following prerequisites installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone the repository or download the script file `onvif.js` to your local machine.
2. Open a terminal or command prompt and navigate to the directory where the script file is located.
3. Run the following command to install the required dependencies:

```shell
    npm install request fs mkdirp path node-cron
```
## Usage
Open the script file onvif.js in a text editor.
Modify the script as needed, changing the NVR configurations and file paths according to your setup.
Save the changes to the script file.
To execute the script, run the following command in a terminal or command prompt:

```shell
node onvif.js
```

## Script Explanation
The script starts by importing the necessary modules and creating a directory (**/mnt/QNAP**) to store the captured snapshots.

The NVRs and their corresponding channels are defined in the nvrs array, which you can modify to match your specific NVR configuration.

The datetitle variable is initialized with the current timestamp. The **cek()** function is then called to initiate the snapshot capture process.

The **cek()** function loops through each NVR and channel, creating an object for each camera with its relevant details (NVR IP, date title, channel, and ID). These camera objects are stored in the cams array.

The **al()** function is responsible for capturing a snapshot from the last camera in the cams array. It creates a directory based on the current date (saveDir) and sets up a write stream to save the snapshot image file.

A request is made to the NVR's snapshot URL using the request module. The response is then piped to the write stream, saving the snapshot to the specified directory.

If an error occurs during the request, the script checks if it is a timeout error. If so, it waits for 15 seconds and retries the request. Otherwise, it logs the error.

Once the snapshot is saved, the al() function is called again to capture the next snapshot until all cameras have been processed.

If there are no more cameras to capture snapshots from, the kucukDosyalariTemizle() function is called to delete small-sized files in the saveDir. Finally, the script waits for 20 minutes before starting the capture process again.

## Customization
NVR Configuration: Modify the **nvrs** array to include your NVRs' IP addresses, titles, and maximum channel numbers.
File Directory: Change the **saveDir** variable to specify the directory path where the captured snapshots should be stored.
Authentication: Modify the username and password in the snapshot URL (**snapshotUri**) to match your NVR's authentication credentials.
Please note that this script assumes a Linux environment and includes a command to mount a network-attached storage (NAS) device. Adjust this section according to your specific requirements if running on a different operating system.

## Schedule
By default, the script is commented out for scheduling using **cron**. If you want to enable automatic periodic execution of the script, uncomment the relevant lines and specify the desired schedule using the **cron.schedule()** function.

## License
This script is released under the **MIT License**. Feel free to modify and distribute it as per your needs.
