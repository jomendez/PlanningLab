CREATE TABLE [dbo].[UserRooms] (
    [Id]       INT              IDENTITY (1, 1) NOT NULL,
    [UserId]   NVARCHAR(250)              NOT NULL,
    [RoomId]   UNIQUEIDENTIFIER NOT NULL,
    [RoomName] VARCHAR (100)    NOT NULL,
    CONSTRAINT [PK_UserRooms] PRIMARY KEY CLUSTERED ([Id] ASC)
);

