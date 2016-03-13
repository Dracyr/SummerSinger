defmodule SummerSinger.Folder do
  use SummerSinger.Web, :model
  alias SummerSinger.Folder

  schema "folders" do
    field :path,  :string
    field :title, :string
    field :root,  :boolean

    belongs_to :parent,   Folder, foreign_key: :parent_id
    has_many   :children, Folder, foreign_key: :parent_id
    has_many   :tracks,   SummerSinger.Track

    timestamps
  end

  @required_fields ~w(path title)
  @optional_fields ~w(parent_id root)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:path)
  end

  def create!(path, root \\ false) do
    {:ok, folder} = Repo.transaction(fn ->
      changeset = case root do
        true ->
          %{
            path: path,
            title: Path.basename(path),
            root: root
          }
        false ->
          parent_path = Path.expand("..", path)
          parent = Repo.get_by(Folder, path: parent_path)
          %{
            path: path,
            title: Path.basename(path),
            parent_id: parent.id,
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
end
