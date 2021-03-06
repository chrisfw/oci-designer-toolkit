# OCI Designer Toolkit [0.11.0](CHANGELOG.md#version-0.11.0)

OCI designer toolKIT (OKIT) is a browser based tool that allows the user to [design](https://www.ateam-oracle.com/introduction-to-okit-the-oci-designer-toolkit), 
[deploy](https://www.ateam-oracle.com/introduction-to-okit-the-oci-designer-toolkit) and visualise ([introspect/query](https://www.ateam-oracle.com/the-oci-designer-toolkit-query-feature)) 
OCI environments through a graphical web based interface. 

- [Design](https://www.ateam-oracle.com/introduction-to-okit-the-oci-designer-toolkit)

    The Web based interface will allow architects and designers to build a visual representation of their infrastructure
    and then export this in a number of formats. 

    - svg
    - png
    - jpeg

- [Generate](https://www.ateam-oracle.com/introduction-to-okit-the-oci-designer-toolkit)

    Once completed the design can be enhanced to add key property information allowing the designed infrastructure to
    be exported to a number of DevOps frameworks.
    
    - Ansible
    - Terraform
    - OCI Resource Manager
    
    This allows for rapid proto-typing and building.

- [Introspect](https://www.ateam-oracle.com/the-oci-designer-toolkit-query-feature)

    OKIT will also allow the user to introspect existing OCI environments, through simple query functionality embedded within the
    web interface, to provide a portable generic json file, that can be used to visualise existing systems or generate terraform/ansible. 



## Installation
Detailed OKIT Installation steps can be found in the [OCI Designer Toolkit Installation Guide](documentation/Installation.md).

### Quick Start
The docker image is the recommended runtime server OKIT provides a simple Docker Compose script to build and start the container.

#### Clone Repository
```bash
git clone --depth 1 https://github.com/oracle/oci-designer-toolkit.git
```

#### Create Config File

Create the OCI cli __config__ file in the directory __oci-designer-toolkit/containers/oci__ with contents similar to that below.
The __*key_file*__ is a fixed value because the contents of the __oci-designer-toolkit/containers/oci__ will be copied to the
appropriate users home directory, as __~/.oci__, during the build process.

```properties
[DEFAULT]
user=ocid1.user.oc1..aaaaaaaak6z......
fingerprint=3b:7e:37:ec:a0:86:1....
key_file=~/.oci/oci_api_key.pem  
tenancy=ocid1.tenancy.oc1..aaaaaaaawpqblfem........
region=us-phoenix-1
```

#### Copy Key File

Copy your __oci_api_key.pem__ to the __oci-designer-toolkit/containers/oci__ directory.

#### Build and Start

```bash
cd oci-designer-toolkit/containers/docker
docker-compose up --detach
```

__*Note:*__ For full connection to OCI you will need to follow the [Installation Create Config File instruction](documentation/Installation.md#oci-config-file) 
prior to building.

Once started the Designer BUI can be accessed on [http://localhost/okit/designer](http://localhost/okit/designer)


## Usage / Examples
The OKIT User / Usage Guide and worked examples can be found in the [OCI Designer Toolkit Usage Guide](documentation/Usage.md)


## Changes

See [CHANGELOG](CHANGELOG.md).

## Known Issues

You can find information on any known issues with OKIT here and under the Issues tab of this project's GitHub repository.
Any issues found with the tool should be raised on the projects issues page. Please check that the issue has not previously
been reported. 


## Contributing
OCI Designer Toolkit is an open source project. See [CONTRIBUTING](CONTRIBUTING.md) for details.

If you would like to extend OKIT the development documentation can be found in [OCI Designer Toolkit Development Guide](documentation/Development.md)


