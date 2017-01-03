defmodule SummerSinger.Folder do
  use SummerSinger.Web, :model

  schema "folders" do
    field :path,  :string
    field :title, :string
    field :root,  :boolean

    belongs_to :library,  SummerSinger.Library
    belongs_to :parent,   Folder, foreign_key: :parent_id
    has_many   :children, Folder, foreign_key: :parent_id
    has_many   :tracks,   SummerSinger.Track

    timestamps
  end

  @allowed_fields ~w(path title root parent_id library_id)

  @doc """
  Creates a changeset based on the `folder` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(folder, params \\ %{}) do
    folder
    |> cast(params, @allowed_fields)
    |> validate_required([:path, :title])
    |> unique_constraint(:path)
  end

  def create!(path, library, root \\ false) do
    {:ok, folder} = Repo.transaction(fn ->
      changeset = if root do
        %{
          path: path,
          title: Path.basename(path),
          library_id: library.id,
          root: root
        }
      else
        parent_path = Path.expand("..", path)
        parent = Repo.get_by(Folder, path: parent_path)
        %{
          path: path,
          title: Path.basename(path),
          parent_id: parent.id,
          library_id: library.id,
          root: root
        }
      end

      Folder.changeset(%Folder{}, changeset) |> Repo.insert!
    end)

    folder
  end

  def orphans do
    from f in Folder,
      where: is_nil(f.parent_id)
  end

  def collect_tracks(folder_id) do
    tracks = Repo.all from t in Track,
      where: t.folder_id == ^folder_id,
      select: t.id

    children = Repo.all from f in Folder,
      where: f.parent_id == ^folder_id,
      select: f.id

    tracks ++ Enum.flat_map(children, &collect_tracks/1)
  end
end
