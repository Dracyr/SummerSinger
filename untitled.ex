alias Experimental.GenStage
import Supervisor.Spec

{:ok, importer} = Importer.start_link("/run/user/1000/gvfs/smb-share:server=192.168.1.10,share=music_store/USB/The Collection/Albums")
{:ok, filterExisting1} = Importer.FilterExisting.start_link()
{:ok, filterExisting2} = Importer.FilterExisting.start_link()
{:ok, metadata1} = Importer.Metadata.start_link()
{:ok, metadata2} = Importer.Metadata.start_link()
{:ok, updater1} = Importer.Updater.start_link()
{:ok, updater2} = Importer.Updater.start_link()
{:ok, final} = Importer.Final.start_link()
:observer.start()

GenStage.sync_subscribe(final, to: updater1)
GenStage.sync_subscribe(final, to: updater2)
GenStage.sync_subscribe(updater1, to: metadata1)
GenStage.sync_subscribe(updater2, to: metadata2)
GenStage.sync_subscribe(metadata1, to: filterExisting1)
GenStage.sync_subscribe(metadata2, to: filterExisting2)
GenStage.sync_subscribe(filterExisting1, to: importer)
GenStage.sync_subscribe(filterExisting2, to: importer)

# children = [
#   worker(Importer, ["/run/user/1000/gvfs/smb-share:server=192.168.1.10,share=music_store/USB/The Collection/Albums"]),
#   worker(Importer.FilterExisting, []),
#   worker(Importer.FilterExisting, []),
#   worker(Importer.Metadata, []),
#   worker(Importer.Updater, []),
#   worker(Importer.Final, []),
# ]



# Supervisor.start_link(children, strategy: :one_for_one)
